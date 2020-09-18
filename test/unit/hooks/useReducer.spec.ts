import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import useReducer from '@hooks/useReducer';

describe('hooks/useState', () => {
  it('test useState', async () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [state, dispatch] = useReducer(reducer, { count: 0 });
          function reducer(state, action) {
            switch (action.type) {
              case 'inc':
                return { count: state.count + 1 };
              case 'dec':
                return { count: state.count - 1 };
              default:
                return state;
            }
          }

          return {
            state,
            dispatch,
          };
        },
      }),
    );

    expect(component.vm.state.count).toBe(0);

    component.vm.dispatch({ type: 'inc' });
    expect(component.vm.state.count).toBe(1);

    component.vm.dispatch({ type: 'inc' });
    expect(component.vm.state.count).toBe(2);

    component.vm.dispatch({ type: 'dec' });
    expect(component.vm.state.count).toBe(1);

    component.vm.dispatch({ type: 'dec' });
    expect(component.vm.state.count).toBe(0);

    component.unmount();
  });

  it('test useReducer initializer', async () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          let initialCount = 0;
          const [state, dispatch] = useReducer(
            reducer,
            { count: initialCount },
            init,
          );

          function init() {
            return { count: initialCount + 8 };
          }

          function reducer(state, action) {
            switch (action.type) {
              case 'inc':
                return { count: state.count + 1 };
              case 'dec':
                return { count: state.count - 1 };
              case 'reset':
                return init();
              default:
                return state;
            }
          }

          return {
            state,
            dispatch,
          };
        },
      }),
    );

    expect(component.vm.state.count).toBe(8);

    component.vm.dispatch({ type: 'inc' });
    expect(component.vm.state.count).toBe(9);

    component.vm.dispatch({ type: 'inc' });
    expect(component.vm.state.count).toBe(10);

    component.vm.dispatch({ type: 'dec' });
    expect(component.vm.state.count).toBe(9);

    component.vm.dispatch({ type: 'reset' });
    expect(component.vm.state.count).toBe(8);

    component.unmount();
  });
});
