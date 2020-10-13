import { mount } from '@vue/test-utils';
import {
  ref,
  computed,
  toRefs,
  defineComponent,
  defineAsyncComponent,
  onMounted,
  onUpdated,
  onUnmounted,
} from 'vue-demi';
import useSWR, { mutate, trigger, useSWRGlobalConfig } from '@hooks/useSWR';
import cache from '@hooks/useSWR/cache';
import { triggerDomEvent, wait } from '@test/utils/helper';

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

  it('should dedupe same key requests within the same component', async () => {
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

  it('should dedupe same key requests within the different components', async () => {
    let count = 0;
    const fetch = () => {
      count++;
      return new Promise(resolve => setTimeout(() => resolve('SWR'), 200));
    };

    const CompA = defineComponent({
      template: `{{ data }}`,
      setup() {
        const { data } = useSWR('constant-5', fetch);
        return {
          data,
        };
      },
    });

    const CompB = defineComponent({
      template: `{{ data }}`,
      setup() {
        const { data } = useSWR('constant-5', fetch);
        return {
          data,
        };
      },
    });

    const component = mount(
      defineComponent({
        components: {
          CompA,
          CompB,
        },
        template: `<CompA />, <CompB />`,
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
            'constant-6',
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
    await wait();
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
        template: `data: {{ data }}`,
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

    await wait();
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);
  });

  it("shouldn't revalidate on focus when revalidateOnFocus is false", async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `data: {{ data }}`,
        setup() {
          const { data } = useSWR('dynamic-6', () => value++, {
            dedupingInterval: 0,
            revalidateOnFocus: false,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    await wait();
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);
  });

  it('revalidateOnFocus shoule be stateful', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `data: {{ data }} <button @click="revalidateOnFocus = !revalidateOnFocus"></button>`,
        setup() {
          const revalidateOnFocus = ref(false);
          const { data } = useSWR('dynamic-revalidateOnFocus', () => value++, {
            dedupingInterval: 0,
            revalidateOnFocus,
            focusThrottleInterval: 0,
          });

          return { data, revalidateOnFocus };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    await wait();
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    await component.find('button').trigger('click');
    await wait();
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);

    await wait();
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 2"`);

    await component.find('button').trigger('click');
    await wait();
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 2"`);
  });

  it('focusThrottleInterval should work', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `data: {{ data }}`,
        setup() {
          const { data } = useSWR('focusThrottleInterval-1', () => value++, {
            dedupingInterval: 0,
            revalidateOnFocus: true,
            focusThrottleInterval: 200,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    await wait();
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait(210);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);

    await wait();
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 2"`);
  });

  it('focusThrottleInterval should be stateful', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `data: {{ data }} <button @click="focusThrottleInterval += 100"></button>`,
        setup() {
          const focusThrottleInterval = ref(200);
          const { data } = useSWR('focusThrottleInterval-2', () => value++, {
            dedupingInterval: 0,
            revalidateOnFocus: true,
            focusThrottleInterval,
          });

          return { data, focusThrottleInterval };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    await wait();
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait(210);
    await wait();
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait(210);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 2"`);

    await component.find('button').trigger('click');
    await wait();
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait(210);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 3"`);

    await wait(100);
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait(310);
    await wait();
    triggerDomEvent('visibilitychange', window);
    triggerDomEvent('focus', window);
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 5"`);
  });
});

describe('useSWR - local mutation', () => {
  it('should trigger revalidation programmatically', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `data: {{ data }}`,
        setup() {
          const { data } = useSWR('dynamic-7', () => value++, {
            dedupingInterval: 0,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    trigger('dynamic-7');
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);
  });

  it('should trigger revalidation programmatically within a dedupingInterval', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `data: {{ data }}`,
        setup() {
          const { data } = useSWR('dynamic-8', () => value++, {
            dedupingInterval: 2000,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    trigger('dynamic-8');
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);
  });

  it('should mutate the cache and revalidate', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `data: {{ data }}`,
        setup() {
          const { data } = useSWR('dynamic-9', () => value++, {
            dedupingInterval: 0,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    mutate('dynamic-9', 'mutate');
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);
  });

  it('should dedupe extra request after mutation', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `data: {{ data }}`,
        setup() {
          const { data } = useSWR('dynamic-10', () => value++, {
            dedupingInterval: 2000,
          });
          useSWR('dynamic-10', () => value++, {
            dedupingInterval: 2000,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    await wait();
    mutate('dynamic-10');
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);
  });

  it('should mutate the chache and revalidate in async', async () => {
    const component = mount(
      defineComponent({
        template: `data: {{ data }}`,
        setup() {
          const { data } = useSWR(
            'dynamic-11',
            () =>
              new Promise(resolve => setTimeout(() => resolve('juice'), 200)),
            {
              dedupingInterval: 0,
            },
          );

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: juice"`);

    await wait();
    mutate('dynamic-11', 'mutate');
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: mutate"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: juice"`);
  });

  it('should support async mutation', async () => {
    const component = mount(
      defineComponent({
        template: `data: {{ data }}`,
        setup() {
          const { data } = useSWR('mutate-1', () => 0, {
            dedupingInterval: 0,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    await wait();
    mutate(
      'mutate-1',
      new Promise(resolve => setTimeout(() => resolve(233), 100)),
      false,
    );
    await wait(110);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 233"`);
  });

  it('should trigger on mutation without data', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `data: {{ data }}`,
        setup() {
          const { data } = useSWR('dynamic-12', () => value++, {
            dedupingInterval: 0,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    await wait();
    mutate('dynamic-12');
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);
  });

  it('should call function as data passing current cached value', async () => {
    cache.set('dynamic-13', 'cached data');
    const callback = jest.fn();
    await mutate('dynamic-13', callback);
    expect(callback).toHaveBeenCalledWith('cached data');
  });

  it('should return results of the mutation', async () => {
    expect(mutate('dynamic-14', Promise.resolve('data'))).resolves.toBe('data');

    expect(
      mutate('dynamic-15', Promise.reject(new Error('error'))),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should get bound mutate from useSWR', async () => {
    const component = mount(
      defineComponent({
        template: `data: {{ data }} <button @click="boundMutate('mutated', false)"></button>`,
        setup() {
          const { data, mutate: boundMutate } = useSWR(
            'dynamic-16',
            () => 'fetched',
          );

          return { data, boundMutate };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: fetched"`);

    await component.find('button').trigger('click');
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: mutated"`);
  });

  it('should ignore in flight requests when mutating', async () => {
    mutate('mutate-2', 1);

    const component = mount(
      defineComponent({
        template: `{{ data }}`,
        setup() {
          const { data } = useSWR(
            'mutate-2',
            () => new Promise(resolve => setTimeout(() => resolve(2), 200)),
          );

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"1"`);

    await wait(150);
    mutate('mutate-2', 3);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"3"`);

    await wait(100);
    expect(component.text()).toMatchInlineSnapshot(`"3"`);
  });

  it('should ignore in flight mutations when calling another async mutate', async () => {
    let value = 'off';
    const key = 'mutate-3';

    const component = mount(
      defineComponent({
        template: `{{ data }}`,
        setup() {
          const { data } = useSWR(
            key,
            () => new Promise(resolve => setTimeout(() => resolve(value), 200)),
          );

          return { data };
        },
      }),
    );

    await wait(250);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"off"`);

    mutate(key, 'on', false);
    expect(
      mutate(
        key,
        new Promise(resolve =>
          setTimeout(() => {
            value = 'on';
            resolve(value);
          }, 200),
        ),
      ),
    ).resolves.toBe('on');

    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"on"`);

    mutate(key, 'off', false);
    expect(
      mutate(
        key,
        new Promise(resolve =>
          setTimeout(() => {
            value = 'off';
            resolve(value);
          }, 400),
        ),
      ),
    ).resolves.toBe('off');

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"on"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"off"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"off"`);
  });

  it('null is stringified when found inside an array', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `data: {{ data }}`,
        setup() {
          const { data } = useSWR([null], () => value++, {
            dedupingInterval: 0,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    await wait();
    trigger([null]);
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);
  });

  it('should return promise from mutate without data', async () => {
    let value = 0;

    const component = mount(
      defineComponent({
        template: `data: {{ data }}`,
        setup() {
          const { data } = useSWR('dynamic-17', () => value++, {
            dedupingInterval: 0,
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    let promise = mutate('dynamic-17');
    expect(promise).toBeInstanceOf(Promise);
    expect(promise).resolves.toBe(1);
    await wait();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);
  });

  it('should update error in cache when mutate failed with error', async () => {
    const value = 0;
    const key = 'mutate-4';
    const message = 'mutate-error';

    const component = mount(
      defineComponent({
        template: `{{ error ? error.message : data }}`,
        setup() {
          const { data, error } = useSWR(key, () => value, {
            dedupingInterval: 0,
          });

          return { data, error };
        },
      }),
    );

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"0"`);

    try {
      await mutate(
        key,
        () => {
          throw new Error(message);
        },
        false,
      );
    } catch (err) {
      // do nothing
    }

    const [, , keyErr] = cache.serializeKey(key);
    let cacheError = cache.get(keyErr);
    expect(cacheError.message).toMatchInlineSnapshot(`"${message}"`);
    expect(component.text()).toMatchInlineSnapshot(`"${message}"`);

    await mutate(key, value, false);
    cacheError = cache.get(keyErr);
    expect(cacheError).toMatchInlineSnapshot(`undefined`);
  });
});

// WIP
// describe('useSWR - suspense', () => {
//   it('should render fallback', async () => {
//     const Block = defineComponent({
//       template: `{{ data }}`,
//       setup() {
//         const { data } = useSWR(
//           'suspense-1',
//           () => new Promise(resolve => setTimeout(() => resolve('SWR'), 100)),
//           {
//             suspense: true,
//           },
//         );

//         return { data };
//       },
//     });

//     const component = mount(
//       defineComponent({
//         components: { Block },
//         template: `
//           <Suspense>
//             <template #default>
//               <Block />
//             </template>
//             <template #fallback>
//               fallback
//             </template>
//           </Suspense>
//         `,
//       }),
//     );

//     expect(component.text()).toMatchInlineSnapshot(`"fallback"`)

//     await wait(110);
//     await component.vm.$nextTick();
//     expect(component.text()).toMatchInlineSnapshot(`"SWR"`)
//   });
// });

// WIP
// describe('useSWR - cache', () => {
//   it('should not react to direct cache updates but mutate', async () => {
//     cache.set('cache-1', 'custom cache message');

//     const component = mount(
//       defineComponent({
//         template: `{{ error ? error.message : data }}`,
//         setup() {
//           const { data, error } = useSWR('cache-1', () => value, {
//             dedupingInterval: 0,
//           });

//           return { data, error };
//         },
//       }),
//     );
//   });
// });

describe('useSWR - key', () => {
  it('should respect requests after key has changed', async () => {
    const component = mount(
      defineComponent({
        template: `{{ data }}`,
        setup() {
          const mounted = ref(0);
          const key = computed(
            () => `key-1-${mounted.value ? 'short' : 'long'}`,
          );
          const { data } = useSWR(key, async () => {
            if (mounted.value) {
              await wait(100);
              return 'short request';
            }
            await wait(200);
            return 'long request';
          });

          onMounted(() => {
            mounted.value = 1;
          });

          return { data, mounted };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`""`);

    await wait();
    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"short request"`);

    await wait(110);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"short request"`);

    component.vm.mounted++;
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"short request"`);
  });

  it('should render undefined after key has changed', async () => {
    const component = mount(
      defineComponent({
        template: `{{ data }}`,
        setup() {
          const mounted = ref(false);
          const key = computed(() => `key-${mounted.value ? 1 : 0}`);
          const { data } = useSWR(key, async k => {
            await wait(200);
            return k;
          });

          onMounted(() => {
            setTimeout(() => (mounted.value = true), 320);
          });

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`""`);

    await wait();
    await wait(210);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"key-0"`);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`""`);

    await wait(140);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"key-1"`);
  });

  it('should return undefined after key change when fetcher is synchronized', async () => {
    const samples = {
      '1': 'a',
      '2': 'b',
    };

    const component = mount(
      defineComponent({
        template: `hello, {{ sampleKey }}:{{ data }} <button @click="sampleKey++"></button>`,
        setup() {
          const sampleKey = ref(1);
          const key = computed(() => `key-2-${sampleKey.value}`);
          const { data } = useSWR(key, k => samples[k.replace('key-2-', '')]);

          return { data, sampleKey };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"hello, 1:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, 1:a"`);

    await component.find('button').trigger('click');
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, 2:"`);

    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, 2:b"`);
  });

  // TODO
  it('should revalidate if a function key changes identity', async () => {
    const closureFunctions: { [key: string]: () => Promise<string> } = {};
    const closureFactory = id =>
      closureFunctions[id] ||
      (closureFunctions[id] = () => Promise.resolve(`data-${id}`));
    const fetcher = fn => fn();

    const component = mount(
      defineComponent({
        template: `{{ data }}`,
        setup() {
          const id = ref('first');
          const key = computed(() => [closureFactory(id.value)]);
          const { data } = useSWR(key, fetcher);

          return { data, id };
        },
      }),
    );

    // const closureSpy = jest.spyOn(closureFunctions, 'first');

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data-first"`);
    // expect(closureSpy).toHaveBeenCalledTimes(1);

    component.vm.id = 'first';
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data-first"`);
    // expect(closureSpy).toHaveBeenCalledTimes(1);

    component.vm.id = 'second';
    await component.vm.$nextTick();
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data-second"`);
  });
});

describe('useSWR - config callbacks', () => {
  it('should trigger the onSuccess event with the latest version of the onSuccess callback', async () => {
    let state = null;
    let count = 0;

    const Block = defineComponent({
      template: `<template>
        hello, {{ data }}, {{ text }} <button @click="revalidate"></button>
      </template>`,
      props: {
        text: String,
      },
      setup(props) {
        const { data, revalidate } = useSWR(
          'callbacks-onSuccess',
          () => new Promise(resolve => setTimeout(() => resolve(count++), 200)),
          { onSuccess: () => (state = props.text) },
        );

        return { data, revalidate, ...toRefs(props) };
      },
    });

    const component = mount(
      defineComponent({
        components: { Block },
        template: `<Block :text="text" />`,
        setup() {
          const text = ref('a');

          return { text };
        },
      }),
    );

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, , a"`);
    expect(state).toBe(null);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, 0, a"`);
    expect(state).toBe('a');

    component.vm.text = 'b';
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, 0, b"`);
    expect(state).toBe('a');

    await component.find('button').trigger('click');
    await wait(201);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, 1, b"`);
    expect(state).toBe('b');
  });

  it('should trigger the onError event with the latest version of the onError callback', async () => {
    let state = null;
    let count = 0;

    const Block = defineComponent({
      template: `<template>
        hello, {{ error ? error.message : data }}, {{ text }} <button @click="revalidate"></button>
      </template>`,
      props: {
        text: String,
      },
      setup(props) {
        const { data, error, revalidate } = useSWR(
          'callbacks-onError',
          () =>
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error(`Error: ${count++}`)), 200),
            ),
          { onError: () => (state = props.text) },
        );

        return { data, error, revalidate, ...toRefs(props) };
      },
    });

    const component = mount(
      defineComponent({
        components: { Block },
        template: `<Block :text="text" />`,
        setup() {
          const text = ref('a');

          return { text };
        },
      }),
    );

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, , a"`);
    expect(state).toBe(null);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, Error: 0, a"`);
    expect(state).toBe('a');

    component.vm.text = 'b';
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, Error: 0, b"`);
    expect(state).toBe('a');

    await component.find('button').trigger('click');
    await wait(201);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, Error: 1, b"`);
    expect(state).toBe('b');
  });

  it('should trigger the onErrorRetry event with the latest version of the onErrorRetry callback', async () => {
    let state = null;
    let count = 0;

    const Block = defineComponent({
      template: `<template>
        hello, {{ error ? error.message : data }}, {{ text }}
      </template>`,
      props: {
        text: String,
      },
      setup(props) {
        const { data, error } = useSWR(
          'callbacks-onErrorRetry',
          () =>
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error(`Error: ${count++}`)), 200),
            ),
          {
            onErrorRetry: (_, __, ___, revalidate, options) => {
              state = props.text;
              setTimeout(() => revalidate(options), 100);
            },
          },
        );

        return { data, error, ...toRefs(props) };
      },
    });

    const component = mount(
      defineComponent({
        components: { Block },
        template: `<Block :text="text" />`,
        setup() {
          const text = ref('a');

          return { text };
        },
      }),
    );

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, , a"`);
    expect(state).toBe(null);

    await wait(200);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, Error: 0, a"`);
    expect(state).toBe('a');

    component.vm.text = 'b';
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, Error: 0, b"`);
    expect(state).toBe('a');

    await wait(301);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, Error: 1, b"`);
    expect(state).toBe('b');
  });

  it('should trigger the onLoadingSlow and onSuccess event with the latest version of the callbacks', async () => {
    let state = null;
    let count = 0;

    const Block = defineComponent({
      template: `<template>
        hello, {{ error ? error.message : data }}, {{ text }}
      </template>`,
      props: {
        text: String,
      },
      setup(props) {
        const { data, error } = useSWR(
          'callbacks-onLoadingSlow',
          () => new Promise(resolve => setTimeout(() => resolve(count++), 200)),
          {
            onLoadingSlow: () => {
              state = props.text;
            },
            onSuccess: () => {
              state = props.text;
            },
            loadingTimeout: 100,
          },
        );

        return { data, error, ...toRefs(props) };
      },
    });

    const component = mount(
      defineComponent({
        components: { Block },
        template: `<Block :text="text" />`,
        setup() {
          const text = ref('a');

          return { text };
        },
      }),
    );

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, , a"`);
    expect(state).toBe(null);

    await wait(101);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, , a"`);
    expect(state).toBe('a');

    component.vm.text = 'b';
    await wait(100);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"hello, 0, b"`);
    expect(state).toBe('b');
  });
});

describe('useSWR - global configs', () => {
  it('should read the config fallback from the config ref', async () => {
    let value = 0;
    const fetcher = () => value++;
    useSWRGlobalConfig({
      fetcher,
      refreshInterval: 100,
      dedupingInterval: 0,
    });

    const component = mount(
      defineComponent({
        template: `data: {{ data }}`,
        setup() {
          const { data } = useSWR('dynamic-18');

          return { data };
        },
      }),
    );

    expect(component.text()).toMatchInlineSnapshot(`"data:"`);

    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 0"`);

    await wait(110);
    await component.vm.$nextTick();
    expect(component.text()).toMatchInlineSnapshot(`"data: 1"`);
  });
});
