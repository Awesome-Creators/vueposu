import { mount } from '@vue/test-utils';
import useClickAway from '@hooks/useClickAway';
import { defineComponent, ref } from 'vue';

describe('hooks/useClickAway', () => {
  it('test single', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const count = ref(0);
          const buttonRef = ref();

          useClickAway(() => {
            count.value += 1;
          }, buttonRef);

          return {
            count,
            buttonRef,
          };
        },
        template: `
          <div>
            <button ref="buttonRef">click me outside</button>
            <span>{{ count }}</span>
          </div>
      `,
      }),
      { attachTo: document.body },
    );

    expect(component.vm.count).toBe(0);

    await component.find('span').trigger('click');
    expect(component.vm.count).toBe(1);

    await component.find('button').trigger('click');
    expect(component.vm.count).toBe(1);

    await document.body.click();
    expect(component.vm.count).toBe(2);

    component.unmount();
  });

  it('test multiple', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const count = ref(0);
          const buttonRef = ref();
          const buttonRef2 = ref();
          const buttonRef3 = ref();

          useClickAway(() => {
            count.value += 1;
          }, [buttonRef, buttonRef2, buttonRef3]);

          return {
            count,
            buttonRef,
            buttonRef2,
            buttonRef3,
          };
        },
        template: `
          <div>
            <button ref="buttonRef">click me outside</button>
            <button ref="buttonRef2">
              click me outside
              <button ref="buttonRef3">click me outside</button>
            </button>
            <br />
            <span>{{ count }}</span>
          </div>
      `,
      }),
      { attachTo: document.body },
    );

    expect(component.vm.count).toBe(0);

    await component.find('span').trigger('click');

    expect(component.vm.count).toBe(1);

    await component.findAll('button')[0].trigger('click');
    expect(component.vm.count).toBe(1);

    await component.findAll('button')[1].trigger('click');
    expect(component.vm.count).toBe(1);

    await component.findAll('button')[2].trigger('click');
    expect(component.vm.count).toBe(1);

    await document.body.click();
    expect(component.vm.count).toBe(2);

    component.unmount();
  });

  it('test otherEvt', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const count = ref(0);
          const buttonRef = ref();

          useClickAway(
            () => {
              count.value += 1;
            },
            buttonRef,
            ['touchstart'],
          );

          return {
            count,
            buttonRef,
          };
        },
        template: `
          <div>
            <button ref="buttonRef">click me outside</button>
            <br />
            <span>{{ count }}</span>
          </div>
    `,
      }),
      { attachTo: document.body },
    );

    expect(component.vm.count).toBe(0);

    await component.find('span').trigger('touchstart');
    expect(component.vm.count).toBe(1);

    await component.find('button').trigger('touchstart');
    expect(component.vm.count).toBe(1);

    await document.body.click();
    expect(component.vm.count).toBe(1);

    component.unmount();
  });

  it('test otherEvtMultiple ', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const count = ref(0);
          const buttonRef = ref();

          useClickAway(
            () => {
              count.value += 1;
            },
            buttonRef,
            ['touchstart', 'click'],
          );

          return {
            count,
            buttonRef,
          };
        },
        template: `
          <div>
            <button ref="buttonRef">click me outside</button>
            <br />
            <span>{{ count }}</span>
          </div>
      `,
      }),
      { attachTo: document.body },
    );

    expect(component.vm.count).toBe(0);

    await component.find('span').trigger('touchstart');
    expect(component.vm.count).toBe(1);

    await component.find('button').trigger('touchstart');
    expect(component.vm.count).toBe(1);

    await document.body.click();
    expect(component.vm.count).toBe(2);

    component.unmount();
  });
});