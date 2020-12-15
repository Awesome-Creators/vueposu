import { computed, getCurrentInstance, isVue3 } from 'vue-demi';

/**
 * Shorthand for v-model binding, props + emit -> ref
 * inspired by antfu vueuse: https://github.com/antfu/vueuse/blob/master/packages/core/useVModel/index.ts
 * @param props
 * @param key
 * @param emit
 */
export function useVModel<P extends object>(
  props: P,
  key: keyof P,
  emit?: (name: string, value: any) => void,
) {
  let _emit = emit;
  if (!emit && isVue3) {
    _emit = getCurrentInstance()?.emit;
  } else {
    emit = (getCurrentInstance() as any)?.$emit;
  }
  return computed({
    get() {
      return props[key];
    },
    set(value) {
      _emit(`update:${key}`, value);
    },
  });
}
