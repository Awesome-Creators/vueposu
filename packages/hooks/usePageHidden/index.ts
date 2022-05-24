import { ref, onMounted, onUnmounted } from "vue-demi";
import { isServer } from "@vueposu/utils";

// the difference platfrom listen
const differencePlatformEvents = [
  "mozvisibilitychange",
  "webkitvisibilitychange",
  "msvisibilitychange",
  "visibilitychange",
];

/**
 * usePageHidden function
 * when user `leave`/`back` current tab will trigger this hook
 * always execute the last one
 *
 * @param onHiddenStatusChange change handler function for usePageHidden
 */
export function usePageHidden() {
  const isHidden = ref(isServer ? false : document.hidden);
  const listener = () =>
    setTimeout(() => (isHidden.value = isServer ? false : document.hidden));

  if (!isServer) {
    onMounted(() => {
      differencePlatformEvents.forEach((event) => {
        document.addEventListener(event, listener);
      });
    });

    onUnmounted(() => {
      differencePlatformEvents.forEach((event) => {
        document.removeEventListener(event, listener);
      });
    });
  }

  return isHidden;
}
