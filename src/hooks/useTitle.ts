import { ref, unref, watch, onBeforeUnmount, getCurrentInstance } from 'vue-demi';

import type { RefTyped } from '../types/global';

/**
 * set the string to the page title.
 *
 * @param overridedTitle The string to set to the page title.
 * @param restoreOnUnmount whether need restore the title on unmount.
 */
function useTitle(
  overridedTitle?: RefTyped<string>,
  restoreOnUnmount: RefTyped<boolean> = true,
) {
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useTitle` can only be called inside of `setup()`.',
    );
  }

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
    if (unref(restoreOnUnmount)) {
      restoreTitle();
    }
    observer.disconnect();
  });

  return { title, restoreTitle };
}

export default useTitle;
