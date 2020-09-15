import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { wait } from '@test/utils/helper';
import useDebounce from '@hooks/useDebounce';

describe('hooks/useDebounce', () => {
  it('test default case', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const count = ref(1);
          const fn = useDebounce(() => (count.value = count.value + 1));
          return {
            count,
            fn,
          };
        },
        template: `
          <div>
            <span id="trigger" @click="fn"></span>
            <span id="cancel" @click="fn.cancel"></span>
          </div>
      `,
      }),
    );

    await component.find('#trigger').trigger('click');
    await wait();
    expect(component.vm.count).toBe(2);

    // multiple test
    await component.find('#trigger').trigger('click');
    await wait();

    await component.find('#trigger').trigger('click');
    await wait();

    await component.find('#trigger').trigger('click');
    await wait();

    expect(component.vm.count).toBe(5);

    // cancel test
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');
    await component.find('#cancel').trigger('click');
    await wait();

    expect(component.vm.count).toBe(5);

    component.unmount();
  });

  it('test common case', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const count = ref(1);
          const fn = useDebounce(() => (count.value = count.value + 1), 300);
          return {
            count,
            fn,
          };
        },
        template: `
          <div>
            <span id="count">{{ count }}</span>
            <span id="trigger" @click="fn"></span>
            <span id="cancel" @click="fn.cancel"></span>
          </div>
      `,
      }),
    );
    await component.find('#trigger').trigger('click');

    await wait();
    expect(component.vm.count).toBe(1);
    await wait(210);
    expect(component.vm.count).toBe(1);
    await wait(310);
    expect(component.vm.count).toBe(2);

    // multiple test
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');

    await wait();
    expect(component.vm.count).toBe(2);

    await wait(210);
    expect(component.vm.count).toBe(2);

    await wait(310);
    expect(component.vm.count).toBe(3);

    // cancel test
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');

    await component.find('#cancel').trigger('click');

    await wait();
    expect(component.vm.count).toBe(3);

    await wait(210);
    expect(component.vm.count).toBe(3);

    await wait(310);
    expect(component.vm.count).toBe(3);

    component.unmount();
  });
});
