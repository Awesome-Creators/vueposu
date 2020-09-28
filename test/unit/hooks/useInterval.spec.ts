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
          useInterval({ cb: fn });
        },
      }),
    );
    // TODO: ...
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

    // TODO: ...
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
    // TODO: ...
  });
});
