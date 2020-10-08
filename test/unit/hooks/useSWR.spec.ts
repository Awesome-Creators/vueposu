import { mount } from '@vue/test-utils';
import {
  ref,
  computed,
  defineComponent,
  onMounted,
  onUpdated,
  onUnmounted,
} from 'vue-demi';
import useSWR from '@hooks/useSWR';
import cache from '@hooks/useSWR/cache';
import { useSWRGlobalConfig } from '@hooks/useSWR/config';
import { wait } from '../../utils/helper';

describe('hooks/useSWR', () => {
  it('should return `undefined` on hydration', () => {
    const component = mount(
      defineComponent({
        template: `hello, {{ typeof data === 'undefined' ? '' : 'ERROR' }}`,
        setup() {
          const { data } = useSWR('constant-1', () => 'SWR');
          return {
            data,
          };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello,"`);
  });

  it('should return data after hydration', async () => {
    const component = mount(
      defineComponent({
        template: `hello, {{ data }}`,
        setup() {
          const { data } = useSWR('constant-2', () => 'SWR');
          return {
            data,
          };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello,"`);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, SWR"`);
  });

  it('should allow functions as key and reuse the cache', async () => {
    const component = mount(
      defineComponent({
        template: `hello, {{ data }}`,
        setup() {
          const { data } = useSWR(
            () => 'constant-2',
            () => 'SWR',
          );
          return {
            data,
          };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello, SWR"`);
  });

  it('should allow async fetcher functions', async () => {
    const component = mount(
      defineComponent({
        template: `hello, {{ data }}`,
        setup() {
          const { data } = useSWR(
            'constant-3',
            () => new Promise(resolve => setTimeout(() => resolve('SWR'), 200)),
          );
          return {
            data,
          };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello,"`);
    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, SWR"`);
  });

  it('should dedupe requests by default', async () => {
    let count = 0;
    const fetch = () => {
      count++;
      return new Promise(resolve => setTimeout(() => resolve('SWR'), 200));
    };

    const component = mount(
      defineComponent({
        template: `{{ fresh }}, {{ juice }}`,
        setup() {
          const { data: fresh } = useSWR('constant-4', fetch);
          const { data: juice } = useSWR('constant-4', fetch);
          return {
            fresh,
            juice,
          };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`","`);
    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"SWR, SWR"`);
    // only fetches once
    expect(count).toBe(1);
  });

  it('should trigger the onSuccess event', async () => {
    let juice = null;

    const component = mount(
      defineComponent({
        template: `hello, {{ data }}`,
        setup() {
          const { data } = useSWR(
            'constant-5',
            () => new Promise(resolve => setTimeout(() => resolve('SWR'), 200)),
            { onSuccess: $data => (juice = $data) },
          );
          return {
            data,
          };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello,"`);
    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, SWR"`);
    expect(juice).toBe('SWR');
  });

  it('should broadcast data', async () => {
    let count = 0;

    const Block = defineComponent({
      template: `{{ data }}`,
      setup() {
        const { data } = useSWR('broadcast-1', () => count++, {
          refreshInterval: 100,
          dedupingInterval: 10,
        });
        return {
          data,
        };
      },
    });

    const component = mount(
      defineComponent({
        components: { Block },
        template: `<Block /> <Block /> <Block />`,
      }),
    );

    await wait(10);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"0 0 0"`);
    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"1 1 1"`);
    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"2 2 2"`);
  });

  it('should broadcast error', async () => {
    let count = 0;

    const Block = defineComponent({
      template: `{{ error ? error.message : data }}`,
      setup() {
        const { data, error } = useSWR(
          'broadcast-2',
          () => {
            if (count === 2) throw new Error('error');
            return count++;
          },
          {
            refreshInterval: 100,
            dedupingInterval: 10,
          },
        );
        return {
          data,
          error,
        };
      },
    });

    const component = mount(
      defineComponent({
        components: { Block },
        template: `<Block /> <Block /> <Block />`,
      }),
    );

    await wait(10);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"0 0 0"`);
    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"1 1 1"`);
    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"error error error"`);
  });

  it('should broadcast isValidating', async () => {
    const useBroadcast = () =>
      useSWR('broadcast-3', () => new Promise(res => setTimeout(res, 100)), {
        dedupingInterval: 10,
      });

    const Initiator = defineComponent({
      template: `{{ isValidating }}`,
      setup() {
        const { isValidating, revalidate } = useBroadcast();
        let timer = null;
        onMounted(() => {
          timer = setTimeout(() => {
            revalidate();
          }, 200);
        });
        onUnmounted(() => clearTimeout(timer));
        return {
          isValidating,
          revalidate,
        };
      },
    });

    const Consumer = defineComponent({
      template: `{{ isValidating }}`,
      setup() {
        const { isValidating } = useBroadcast();
        return {
          isValidating,
        };
      },
    });

    const component = mount(
      defineComponent({
        components: { Initiator, Consumer },
        template: `<Initiator /> <Consumer /> <Consumer />`,
      }),
    );
    expect(component.text()).toMatchInlineSnapshot(`"true true true"`);
    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"false false false"`);
    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"true true true"`);
    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"false false false"`);
  });

  it('should accept object args', async () => {
    const obj = { text: 'fresh' };
    const arr = ['juice'];

    const component = mount(
      defineComponent({
        template: `{{ a }} {{ b }} {{ c }}`,
        setup() {
          const { data: a } = useSWR(
            ['args-1', obj, arr],
            (a, b, c) => a + b.text + c[0],
          );

          // reuse the cache
          const { data: b } = useSWR(['args-1', obj, arr], () => 'not called!');

          // different object
          const { data: c } = useSWR(
            ['args-2', obj, 'juice'],
            (a, b, c) => a + b.text + c,
          );

          return {
            a,
            b,
            c,
          };
        },
      }),
    );

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(
      `"args-1freshjuice args-1freshjuice args-2freshjuice"`,
    );
  });

  it('should accept function returning args', async () => {
    const obj = { text: 'fresh' };
    const arr = ['juice'];

    const component = mount(
      defineComponent({
        template: `{{ data }}`,
        setup() {
          const { data } = useSWR(
            ['args-3', obj, arr],
            (a, b, c) => a + b.text + c[0],
          );

          return {
            data,
          };
        },
      }),
    );

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"args-3freshjuice"`);
  });

  it('should accept initial data', async () => {
    const fetcher = jest.fn(() => 'SWR');

    const component = mount(
      defineComponent({
        template: `hello, {{ data }}`,
        setup() {
          const { data } = useSWR('initial-data-1', fetcher, {
            initialData: 'Initial',
          });

          return {
            data,
          };
        },
      }),
    );

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, Initial"`);
  });

  it('should set config as second parameter', async () => {
    const fetcher = jest.fn(() => 'SWR');

    const component = mount(
      defineComponent({
        template: `hello, {{ data }}`,
        setup() {
          const { data } = useSWR('config-as-second-param', {
            fetcher,
          });

          return {
            data,
          };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello,"`);
    expect(fetcher).toBeCalled();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, SWR"`);
  });
});

describe('useSWR - loading', () => {
  const loadData = () =>
    new Promise(resolve => setTimeout(() => resolve('data'), 100));

  it('should return loading state', async () => {
    let renderCount = 0;

    const component = mount(
      defineComponent({
        template: `hello, {{ data }}, {{ isValidating ? 'loading' : 'ready' }}`,
        setup() {
          const { data, isValidating } = useSWR('is-validating-1', loadData);

          onMounted(() => {
            renderCount++;
          });
          onUpdated(() => {
            renderCount++;
          });

          return {
            data,
            isValidating,
          };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello, , loading"`);
    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, data, ready"`);
    expect(renderCount).toBe(2);
  });

  it('should avoid extra rerenders', async () => {
    let renderCount = 0;

    const component = mount(
      defineComponent({
        template: `hello, {{ data }}`,
        setup() {
          const { data } = useSWR('is-validating-2', loadData);

          onMounted(() => {
            renderCount++;
          });
          onUpdated(() => {
            renderCount++;
          });

          return {
            data,
          };
        },
      }),
    );

    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, data"`);

    expect(renderCount).toEqual(2);
  });

  it('should avoid extra rerenders while fetching', async () => {
    let renderCount = 0,
      dataLoaded = false;

    const loadDataWithLog = () =>
      new Promise(resolve =>
        setTimeout(() => {
          dataLoaded = true;
          resolve('data');
        }, 100),
      );

    const component = mount(
      defineComponent({
        template: `hello`,
        setup() {
          useSWR('is-validating-3', loadDataWithLog);

          onMounted(() => {
            renderCount++;
          });
          onUpdated(() => {
            renderCount++;
          });
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello"`);
    await wait(110);
    expect(renderCount).toBe(1);
    expect(dataLoaded).toBe(true);
  });
});

describe('useSWR - refresh', () => {
  it('should rerender automatically on interval', async () => {
    let count = 0;

    const component = mount(
      defineComponent({
        template: `count: {{ data }}`,
        setup() {
          const { data } = useSWR('dynamic-1', () => count++, {
            refreshInterval: 200,
            dedupingInterval: 100,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"count:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 0"`);

    await wait(210);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 1"`);

    await wait(50);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 1"`);

    await wait(150);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 2"`);
  });

  it('should dedupe requests combined with intervals', async () => {
    let count = 0;

    const component = mount(
      defineComponent({
        template: `count: {{ data }}`,
        setup() {
          const { data } = useSWR('dynamic-2', () => count++, {
            refreshInterval: 200,
            dedupingInterval: 300,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"count:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 0"`);

    await wait(210);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 0"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 1"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 1"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 2"`);
  });

  it('should update data upon interval changes', async () => {
    let count = 0;

    const component = mount(
      defineComponent({
        template: `count: {{ data }} <button @click="refreshInterval = refreshInterval < 400 ? refreshInterval + 100 : 0"></button>`,
        setup() {
          const refreshInterval = ref(200);
          const { data } = useSWR('interval-changes', () => count++, {
            refreshInterval,
            dedupingInterval: 100,
          });

          return { data, refreshInterval };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"count:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 0"`);

    await wait(210);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 1"`);

    await wait(50);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 1"`);

    await wait(150);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 2"`);

    await component.find('button').trigger('click');
    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 2"`);

    await wait(110);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 3"`);

    await wait(310);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 4"`);

    await component.find('button').trigger('click');
    await wait(300);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 4"`);

    await wait(110);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 5"`);

    await component.find('button').trigger('click');
    await wait(110);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 5"`);

    await wait(110);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 5"`);
  });

  it('should update data upon interval changes -- changes happend during revalidate', async () => {
    let count = 0;
    const STOP_POLLING_THRESHOLD = 2;

    const component = mount(
      defineComponent({
        template: `count: {{ data }} {{ flag }} <button @click="flag = 0"></button>`,
        setup() {
          const flag = ref(0);
          const { data } = useSWR(
            'interval-changes-during-revalidate',
            () => count++,
            {
              refreshInterval: computed(() =>
                flag.value < STOP_POLLING_THRESHOLD ? 200 : 0,
              ),
              dedupingInterval: 100,
              onSuccess() {
                flag.value++;
              },
            },
          );

          return { data, flag };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"count:  0"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 0 1"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 1 2"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 1 2"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 1 2"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 1 2"`);

    await component.find('button').trigger('click');
    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 1 0"`);

    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 2 1"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 3 2"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 3 2"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"count: 3 2"`);
  });
});

describe('useSWR - revalidate', () => {
  it('should rerender after triggering revalidation', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `<button @click="revalidate">data: {{ data }}</button>`,
        setup() {
          const { data, revalidate } = useSWR('dynamic-3', () => value++);

          return { data, revalidate };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    await component.find('button').trigger('click');
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);
  });

  it('should revalidate all the hooks with the same key', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `<button @click="revalidate">{{ a }}, {{ b }}</button>`,
        setup() {
          const { data: a, revalidate } = useSWR('dynamic-4', () => value++);
          const { data: b } = useSWR('dynamic-4', () => value++);

          return { a, b, revalidate };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`","`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"0, 0"`);

    await component.find('button').trigger('click');
    await wait(1);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"1, 1"`);
  });

  it('should respect sequences of revalidation calls (cope with race condition)', async () => {
    let faster = false;

    const component = mount(
      defineComponent({
        template: `<button @click="revalidate">{{ data }}</button>`,
        setup() {
          const { data, revalidate } = useSWR(
            'race',
            () =>
              new Promise(res => {
                const value = faster ? 1 : 0;
                setTimeout(() => res(value), faster ? 100 : 200);
              }),
          );

          return { data, revalidate };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`""`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"0"`);

    faster = false;
    await component.find('button').trigger('click');
    await wait(10);
    faster = true;
    await component.find('button').trigger('click');
    await wait(210);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"1"`);
  });
});

describe('useSWR - error', () => {
  it('should handle erros', async () => {
    const component = mount(
      defineComponent({
        template: `hello, {{ error ? error.message : data }}`,
        setup() {
          const { data, error } = useSWR(
            'error-1',
            () =>
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('error!')), 200),
              ),
          );

          return { data, error };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello,"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, error!"`);
  });

  it('should trigger the onError event', async () => {
    let errored = null;

    const component = mount(
      defineComponent({
        template: `hello, {{ error ? error.message : data }}`,
        setup() {
          const { data, error } = useSWR(
            'error-2',
            () =>
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('error!')), 200),
              ),
            { onError: (_, key) => (errored = key) },
          );

          return { data, error };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello,"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, error!"`);
    expect(errored).toBe('error-2');
  });

  it('should trigger error retry', async () => {
    let count = 0;

    const component = mount(
      defineComponent({
        template: `hello, {{ error ? error.message : data }}`,
        setup() {
          const { data, error } = useSWR(
            'error-3',
            () =>
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('error: ' + count++)), 100),
              ),
            {
              onErrorRetry: (_, __, ___, revalidate, revalidateOpts) => {
                setTimeout(() => revalidate(revalidateOpts), 100);
              },
              dedupingInterval: 0,
            },
          );

          return { data, error };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello,"`);

    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, error: 0"`);

    await wait(210);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, error: 1"`);

    await wait(210);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, error: 2"`);
  });

  it('should trigger the onLoadingSlow and onSuccess event', async () => {
    let loadingSlow = null,
      success = null;

    const component = mount(
      defineComponent({
        template: `hello, {{ data }}`,
        setup() {
          const { data } = useSWR(
            'error-4',
            () => new Promise(resolve => setTimeout(() => resolve('SWR'), 200)),
            {
              onLoadingSlow: key => (loadingSlow = key),
              onSuccess: (_, key) => (success = key),
              loadingTimeout: 100,
            },
          );

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello,"`);
    expect(loadingSlow).toBe(null);

    await wait(110);
    expect(loadingSlow).toBe('error-4');
    expect(success).toBe(null);

    await wait(100);
    expect(success).toBe('error-4');
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, SWR"`);
  });

  it('should trigger limited error retries if errorRetryCount exists', async () => {
    let count = 0;

    const component = mount(
      defineComponent({
        template: `hello, {{ error ? error.message : data }}`,
        setup() {
          const { data, error } = useSWR(
            'error-5',
            () => {
              return new Promise((_, reject) =>
                setTimeout(() => reject(new Error('error: ' + count++)), 100),
              );
            },
            {
              errorRetryCount: 1,
              errorRetryInterval: 50,
              dedupingInterval: 0,
            },
          );

          return { data, error };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello,"`);

    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, error: 0"`);

    await wait(210);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, error: 1"`);

    await wait(210);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, error: 1"`);
  });

  it('should not trigger the onLoadingSlow and onSuccess event after component unmount', async () => {
    let loadingSlow = null,
      success = null;

    const Block = defineComponent({
      template: `hello, {{ data }}`,
      setup() {
        const { data } = useSWR(
          'error-6',
          () => new Promise(resolve => setTimeout(() => resolve('SWR'), 200)),
          {
            onLoadingSlow: key => {
              loadingSlow = key;
            },
            onSuccess: (_, key) => {
              success = key;
            },
            loadingTimeout: 100,
          },
        );

        return { data };
      },
    });

    const component = mount(
      defineComponent({
        components: { Block },
        template: `<Block v-if="on" /> <button @click="on = !on"></button>`,
        setup() {
          const on = ref(true);

          return { on };
        },
      }),
    );

    expect(loadingSlow).toBe(null);
    expect(success).toBe(null);

    await wait(10);
    await component.find('button').trigger('click');
    await wait(200);
    expect(loadingSlow).toBe(null);
    expect(success).toBe(null);
  });

  it('should not trigger the onError and onErrorRetry event after component unmount', async () => {
    let retry = null,
      failed = null;

    const Block = defineComponent({
      template: `{{ data }}`,
      setup() {
        const { data } = useSWR(
          'error-7',
          () =>
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('error!')), 200),
            ),
          {
            onError: (_, key) => {
              failed = key;
            },
            onErrorRetry: (_, key) => {
              retry = key;
            },
            dedupingInterval: 0,
          },
        );

        return { data };
      },
    });

    const component = mount(
      defineComponent({
        components: { Block },
        template: `<Block v-if="on" /> <button @click="on = !on"></button>`,
        setup() {
          const on = ref(true);

          return { on };
        },
      }),
    );

    expect(retry).toBe(null);
    expect(failed).toBe(null);

    await wait(10);
    await component.find('button').trigger('click');
    await wait(200);
    expect(retry).toBe(null);
    expect(failed).toBe(null);
  });

  it('should not trigger error retries if errorRetryCount is set to 0', async () => {
    let count = 0;

    const component = mount(
      defineComponent({
        template: `hello, {{ error ? error.message : data }}`,
        setup() {
          const { data, error } = useSWR(
            'error-8',
            () =>
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('error: ' + count++)), 100),
              ),
            {
              errorRetryCount: 0,
              errorRetryInterval: 50,
              dedupingInterval: 0,
            },
          );

          return { data, error };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello,"`);

    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, error: 0"`);

    await wait(210);
    await component.vm.$nextTick(); // retry
    expect(component.text()).toMatchInlineSnapshot(`"hello, error: 0"`);
  });
});

describe('useSWR - focus', () => {
  it('should revalidate on focus by default', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `<div>data: {{ data }}</div>`,
        setup() {
          const { data } = useSWR('dynamic-5', () => value++, {
            dedupingInterval: 0,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    // TODO
    // await component.trigger('blur');
    // await component.trigger('focus');
    // await wait(1);
    // await component.vm.$nextTick();
    // expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);
  });
});
