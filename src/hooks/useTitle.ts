import { ref, watch, onBeforeUnmount, getCurrentInstance } from 'vue-demi';

import type { RefTyped } from '../types/global';

/**
 * set the string to the page title.
 *
 * @param overridedTitle The string to set to the page title.
 * @param restoreOnUnmount whether need restore the title on unmount.
 */
export default function useTitle(
  overridedTitle?: RefTyped<string>,
  restoreOnUnmount: boolean = true,
) {
  if (getCurrentInstance()) {
    const originalTitle = document.title;
    const title = ref(overridedTitle || originalTitle);

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

    const observer = new MutationObserver(
      m => (title.value = m[0].target.textContent),
    );
    observer.observe(document.querySelector('title'), { childList: true });

    const restoreTitle = () => {
      title.value = originalTitle;
    };

    onBeforeUnmount(() => {
      if (restoreOnUnmount) {
        restoreTitle();
      }
      observer.disconnect();
    });

    return { title, restoreTitle };
  } else {
    throw new Error(
      'Invalid hook call: `useTitle` can only be called inside of `setup()`.',
    );
  }
}
