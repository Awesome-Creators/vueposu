import { ref, unref, watch, onBeforeUnmount } from "vue-demi";
import { isServer } from "@vueposu/utils";

import type { Ref } from "vue-demi";
import type { RefTyped } from "@vueposu/utils";

type UseTitleReturnType = {
  title: Ref<string>;
  restoreTitle: () => void;
};

/**
 * set the string to the page title.
 *
 * @param overridedTitle The string to set to the page title.
 * @param restoreOnUnmount whether need restore the title on unmount.
 */
export function useTitle(
  overridedTitle?: RefTyped<string>,
  restoreOnUnmount: RefTyped<boolean> = true
): UseTitleReturnType {
  const originalTitle = isServer ? "" : document.title;
  const title = ref(overridedTitle || originalTitle);

  if (!document.querySelector("title")) {
    document.head.appendChild(document.createElement("title"));
  }
  const titleNode = document.querySelector("title");

  watch(
    title,
    () => {
      if (!isServer) {
        document.title = title.value;
      }
    },
    {
      immediate: true,
      flush: "sync",
    }
  );

  let observer: MutationObserver | null = null;

  if (!isServer) {
    observer = new window.MutationObserver(
      (m) => (title.value = m[0].target.textContent + "")
    );
    observer.observe(titleNode as HTMLTitleElement, {
      childList: true,
    });
  }

  const restoreTitle = () => {
    title.value = originalTitle;
  };

  onBeforeUnmount(() => {
    if (unref(restoreOnUnmount)) {
      restoreTitle();
    }
    if (observer) observer.disconnect();
  });

  return { title, restoreTitle };
}
