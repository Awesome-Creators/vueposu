import { defineComponent } from 'vue-demi';
import useInterval from '@hooks/useInterval';
import { mount } from '@vue/test-utils';
import { wait } from '../../utils/helper';

jest.setTimeout(100000);

describe('hooks/useInterval', () => {
  it('just callback', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [active] = useInterval({ cb: fn });
          return {
            active,
          };
        },
      }),
    );

    expect(component.vm.active).toBe(true);

    await wait(2100);
    expect(fn).toBeCalledTimes(2);
    expect(component.vm.active).toBe(true);

    component.unmount();
    expect(component.vm.active).toBe(false);

    await wait(1100);
    expect(fn).toBeCalledTimes(2);
    expect(component.vm.active).toBe(false);
  });

  it('custom time', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [active] = useInterval({ cb: fn, interval: 300 });
          return {
            active,
          };
        },
      }),
    );

    expect(component.vm.active).toBe(true);
    await wait(1000);
    expect(fn).toBeCalledTimes(3);
    component.unmount();
    expect(component.vm.active).toBe(false);

    await wait(1000);
    expect(fn).toBeCalledTimes(3);
    expect(component.vm.active).toBe(false);
  });

  it('test immediateStart = false', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [active, start, stop] = useInterval({
            cb: fn,
            immediateStart: false,
          });
          return {
            active,
            start,
            stop,
          };
        },
      }),
    );

    expect(component.vm.active).toBe(false);
    await wait(1100);
    expect(fn).toBeCalledTimes(0);
    expect(component.vm.active).toBe(false);

    component.vm.start();
    expect(component.vm.active).toBe(true);
    await wait(2100);
    expect(fn).toBeCalledTimes(2);
    expect(component.vm.active).toBe(true);

    component.vm.stop();
    expect(component.vm.active).toBe(false);
    await wait(1100);
    expect(component.vm.active).toBe(false);
    expect(fn).toBeCalledTimes(2);

    component.unmount();
    expect(component.vm.active).toBe(false);

    await wait(1100);
    expect(fn).toBeCalledTimes(2);
    expect(component.vm.active).toBe(false);
  });
});
