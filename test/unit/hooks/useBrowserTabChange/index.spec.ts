import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import useBrowserTabChange from '@hooks/useBrowserTabChange';
import Common from './test.common.comp.vue';
import NotOptions from './test.notOptions.comp.vue';
import SingleOptions from './test.singleOptions.comp.vue';
import MockJs from './test.mockjs.comp.vue';
import { triggerDomEvent, wait } from '@test/utils/helper';
import { defineComponent } from 'vue';

describe('hooks/useBrowserTabChange', () => {
  beforeEach(() => {
    let val = true;
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      set($val) {
        val = $val;
      },
      get: function () {
        return val;
      },
    });
  });

  it('test options', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const $leave = ref(false);
          const $back = ref(true);
          const [$leaveRef, $backRef] = useBrowserTabChange({
            leave: () => {
              $leave.value = true;
              $back.value = false;
            },
            back: () => {
              $leave.value = false;
              $back.value = true;
            },
          });
          return { $leave, $back, $leaveRef, $backRef };
        },
        template: `
          <div>
            <span id="leave">{{ $leave }}</span>
            <span id="back">{{ $back }}</span>
            <span id="leaveRef">{{ $leaveRef }}</span>
            <span id="backRef">{{ $backRef }}</span>
          </div>
      `,
      }),
    );
    expect(component.find('#leave').text()).toBe('false');
    expect(component.find('#back').text()).toBe('true');
    expect(component.find('#leaveRef').text()).toBe('false');
    expect(component.find('#backRef').text()).toBe('true');

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    // wait dom change
    await wait();
    expect(component.find('#leave').text()).toBe('true');
    expect(component.find('#back').text()).toBe('false');
    expect(component.find('#leaveRef').text()).toBe('true');
    expect(component.find('#backRef').text()).toBe('false');

    // back
    triggerDomEvent('visibilitychange');
    (document as any).hidden = false;

    // wait dom change
    await wait();
    expect(component.find('#leave').text()).toBe('false');
    expect(component.find('#back').text()).toBe('true');
    expect(component.find('#leaveRef').text()).toBe('false');
    expect(component.find('#backRef').text()).toBe('true');

    component.unmount();
  });

  it('test common', async () => {
    const component = mount(Common);
    expect(component.find('#leave').text()).toBe('false');
    expect(component.find('#back').text()).toBe('true');
    expect(component.find('#leaveRef').text()).toBe('false');
    expect(component.find('#backRef').text()).toBe('true');

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    // wait dom change
    await wait();
    expect(component.find('#leave').text()).toBe('true');
    expect(component.find('#back').text()).toBe('false');
    expect(component.find('#leaveRef').text()).toBe('true');
    expect(component.find('#backRef').text()).toBe('false');

    // back
    triggerDomEvent('visibilitychange');
    (document as any).hidden = false;

    // wait dom change
    await wait();
    expect(component.find('#leave').text()).toBe('false');
    expect(component.find('#back').text()).toBe('true');
    expect(component.find('#leaveRef').text()).toBe('false');
    expect(component.find('#backRef').text()).toBe('true');

    component.unmount();
  });

  it('test not options', async () => {
    const component = mount(NotOptions);
    expect(component.find('#leave').text()).toBe('false');
    expect(component.find('#back').text()).toBe('true');
    expect(component.find('#leaveRef').text()).toBe('false');
    expect(component.find('#backRef').text()).toBe('true');

    component.unmount();
  });

  it('test single options', async () => {
    const component = mount(SingleOptions);
    expect(component.find('#count').text()).toBe('0');
    expect(component.find('#leaveRef').text()).toBe('false');
    expect(component.find('#backRef').text()).toBe('true');

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    await wait();
    expect(component.find('#count').text()).toBe('1');
    expect(component.find('#leaveRef').text()).toBe('true');
    expect(component.find('#backRef').text()).toBe('false');

    // back
    triggerDomEvent('visibilitychange');
    (document as any).hidden = false;

    await wait();
    expect(component.find('#count').text()).toBe('1');
    expect(component.find('#leaveRef').text()).toBe('false');
    expect(component.find('#backRef').text()).toBe('true');

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    await wait();
    expect(component.find('#count').text()).toBe('2');
    expect(component.find('#leaveRef').text()).toBe('true');
    expect(component.find('#backRef').text()).toBe('false');

    component.unmount();
  });

  it('mock js user', async () => {
    const component = mount(MockJs);
    expect(component.find('#leaveRef').text()).toBe('false');
    expect(component.find('#backRef').text()).toBe('true');

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    await wait();
    expect(component.find('#leaveRef').text()).toBe('true');
    expect(component.find('#backRef').text()).toBe('false');

    // back
    triggerDomEvent('visibilitychange');
    (document as any).hidden = false;

    await wait();
    expect(component.find('#leaveRef').text()).toBe('false');
    expect(component.find('#backRef').text()).toBe('true');

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    await wait();
    expect(component.find('#leaveRef').text()).toBe('true');
    expect(component.find('#backRef').text()).toBe('false');
    component.unmount();
  });

  // it('test unmount', async () => {
  //   const removeEventListener = document.removeEventListener.bind(document);
  //   const fn = jest.fn();
  //   document.removeEventListener = (...args) => {
  //     removeEventListener(...args);
  //     fn();
  //   };

  //   const component = mount(Options);
  //   component.unmount();

  //   expect(fn).toBeCalledTimes(4);
  // });
});
