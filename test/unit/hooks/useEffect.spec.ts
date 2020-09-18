import { mount } from '@vue/test-utils';
import { defineComponent, onMounted, ref } from 'vue-demi';
import useEffect from '@hooks/useEffect';

describe('hooks/useEffect', () => {
  it('test not deps', () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          useEffect(() => {
            return () => {
              fn();
            };
          });
        },
      }),
    );
    component.unmount();
    expect(fn).toBeCalledTimes(1);
  });

  it('test deps', async done => {
    const fn = jest.fn();

    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const val = ref(0);

          useEffect(() => {
            if (val.value === 20) {
              fn();
            }
            return () => {
              val.value = 1;
              fn();
            };
          }, [val]);

          onMounted(() => {
            setTimeout(() => {
              val.value = 20;
            }, 200);
          });

          return {
            val,
          };
        },
      }),
    );

    await new Promise(res => {
      setTimeout(() => {
        res(null);
        expect(fn).toBeCalledTimes(1);
      }, 300);
    });

    component.unmount();

    expect(fn).toBeCalledTimes(2);
    done();
  });

  it('test empty deps', async done => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          useEffect(() => {
            return () => {
              fn();
            };
          }, []);
        },
      }),
    );
    component.unmount();
    expect(fn).toBeCalledTimes(1);
    done();
  });
});
