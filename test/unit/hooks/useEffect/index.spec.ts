import { mount } from '@vue/test-utils';
import NotDeps from './test.notdeps.comp.vue';
import Deps from './test.deps.comp.vue';
import EmptyDeps from './test.emptydeps.comp.vue';

describe('useEffect', () => {
  it('test not deps', () => {
    (window as any).testNotDepsEffect = 1;
    const component = mount(NotDeps);
    component.unmount();
    expect((window as any).testNotDepsEffect).toBe(0);
  });

  it('test deps', async done => {
    (window as any).testDepsEffect = 1;
    (window as any).testDepsSpy = jest.fn();

    const component = mount(Deps);

    await new Promise(res => {
      setTimeout(() => {
        res(null);
        expect((window as any).testDepsEffect).toBe(20);
      }, 300);
    });

    component.unmount();

    expect((window as any).testDepsEffect).toBe(0);
    expect((window as any).testDepsSpy).toBeCalledTimes(2);
    done();
  });

  it('test empty deps', async done => {
    (window as any).testEmptyDepsEffect = 1;
    (window as any).testEmptyDepsSpy = jest.fn();

    const component = mount(EmptyDeps);
    component.unmount();

    expect((window as any).testEmptyDepsEffect).toBe(0);
    expect((window as any).testEmptyDepsSpy).toBeCalledTimes(1);
    done();
  });
});
