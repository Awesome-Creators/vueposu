import { ref, watch, getCurrentInstance } from 'vue';
import type { RefTyped } from '../types/global';

/**
 * set the string to the page title.
 *
 * @param title The string to set to the page title.
 */
export default function useTitle(overridedTitle?: RefTyped<string>) {
  if (getCurrentInstance()) {
    const title = ref(overridedTitle || document.title);

    watch(
      title,
      () => {
        document.title = title.value;
      },
      {
        immediate: true,
        flush: 'sync',
      },
    );

    return title;
  } else {
    throw new Error(
      'Invalid hook call: `useTitle` can only be called inside of `setup()`.',
    );
  }
}
