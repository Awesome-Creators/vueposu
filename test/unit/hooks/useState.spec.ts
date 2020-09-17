import { mount } from '@vue/test-utils';
import useState from '@hooks/useState';
import { defineComponent } from 'vue';

describe('hooks/useState', () => {
  it('test useState', async () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [count, setCount] = useState(0);
          return {
            count,
            setCount,
          };
        },
      }),
    );

    expect(component.vm.count).toBe(0);

    component.vm.setCount(component.vm.count + 1);
    expect(component.vm.count).toBe(1);

    component.vm.setCount(1);
    expect(component.vm.count).toBe(1);

    component.vm.setCount(component.vm.count + 1);
    expect(component.vm.count).toBe(2);

    component.vm.setCount(component.vm.count - 1);
    expect(component.vm.count).toBe(1);

    component.vm.setCount(component.vm.count - 1);

    expect(component.vm.count).toBe(0);
    component.unmount();
  });

  it('test useState callback', async () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [count, setCount] = useState(() => 0);
          return {
            count,
            setCount,
          };
        },
      }),
    );

    expect(component.vm.count).toBe(0);

    component.vm.setCount(count => count + 1);
    expect(component.vm.count).toBe(1);

    component.vm.setCount(count => count + 1);
    expect(component.vm.count).toBe(2);

    component.vm.setCount(count => count - 1);
    expect(component.vm.count).toBe(1);

    component.vm.setCount(count => count - 1);

    expect(component.vm.count).toBe(0);

    component.unmount();
  });
});
