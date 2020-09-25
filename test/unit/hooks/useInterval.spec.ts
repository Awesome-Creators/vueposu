import { defineComponent } from 'vue-demi';
import useInterval from '@hooks/useInterval';
import { mount } from '@vue/test-utils';
import { wait } from '../../utils/helper';

describe('hooks/useInterval', () => {
  it('just callback', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          useInterval({ cb: fn });
        },
      }),
    );
    await wait(2100);
    expect(fn).toBeCalledTimes(2);
    component.unmount();
  });

  it('custom time', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          useInterval({ cb: fn, interval: 300 });
        },
      }),
    );
    await wait(1000);
    expect(fn).toBeCalledTimes(3);
    component.unmount();
  });

  it('test immediateStart = false', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [start, stop] = useInterval({ cb: fn, immediateStart: false });
          return {
            start,
            stop,
          };
        },
      }),
    );
    await wait(1100);
    expect(fn).toBeCalledTimes(0);

    component.vm.start();
    await wait(2100);
    expect(fn).toBeCalledTimes(2);

    component.vm.stop();
    await wait(1100);
    expect(fn).toBeCalledTimes(2);

    component.unmount();
  });
});
