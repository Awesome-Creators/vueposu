import { mount } from '@vue/test-utils';
import Single from './test.single.comp.vue';
import Multiple from './test.multiple.comp.vue';
import OtherEvt from './test.otherEvt.comp.vue';
import OtherEvtMultiple from './test.otherEvtMultiple.comp.vue';

describe('useClickAway', () => {
  it('test single', async () => {
    const component = mount(Single, { attachTo: document.body });
    expect(component.find('span').text()).toBe('0');

    await component.find('span').trigger('click');
    expect(component.find('span').text()).toBe('1');

    await component.find('button').trigger('click');
    expect(component.find('span').text()).toBe('1');

    await document.body.click();
    expect(component.find('span').text()).toBe('2');

    component.unmount();
  });

  it('test multiple', async () => {
    const component = mount(Multiple, { attachTo: document.body });
    expect(component.find('span').text()).toBe('0');

    await component.find('span').trigger('click');
    expect(component.find('span').text()).toBe('1');

    await component.findAll('button')[0].trigger('click');
    expect(component.find('span').text()).toBe('1');

    await component.findAll('button')[1].trigger('click');
    expect(component.find('span').text()).toBe('1');

    await component.findAll('button')[2].trigger('click');
    expect(component.find('span').text()).toBe('1');

    await document.body.click();
    expect(component.find('span').text()).toBe('2');

    component.unmount();
  });

  it('test otherEvt', async () => {
    const component = mount(OtherEvt, { attachTo: document.body });
    expect(component.find('span').text()).toBe('0');

    await component.find('span').trigger('touchstart');
    expect(component.find('span').text()).toBe('1');

    await component.find('button').trigger('touchstart');
    expect(component.find('span').text()).toBe('1');

    await document.body.click();
    expect(component.find('span').text()).toBe('1');

    component.unmount();
  });

  it('test otherEvtMultiple ', async () => {
    const component = mount(OtherEvtMultiple, { attachTo: document.body });
    expect(component.find('span').text()).toBe('0');

    await component.find('span').trigger('touchstart');
    expect(component.find('span').text()).toBe('1');

    await component.find('button').trigger('touchstart');
    expect(component.find('span').text()).toBe('1');

    await document.body.click();
    expect(component.find('span').text()).toBe('2');

    component.unmount();
  });
});
