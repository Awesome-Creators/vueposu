import { onMounted, onUnmounted, getCurrentInstance } from 'vue-demi';

// the difference platfrom listen
const differencePlatformEvents = [
  'mozvisibilitychange',
  'webkitvisibilitychange',
  'msvisibilitychange',
  'visibilitychange',
];

/**
 * useBrowserTabChange function
 * when user `leave`/`back` current tab will trigger this hook
 * always execute the last one
 *
 * @param onHiddenStatusChange change handler function for useBrowserTabChange
 */
export default function useBrowserTabChange(
  onHiddenStatusChange: (isHidden?: boolean) => void,
) {
  if (getCurrentInstance()) {
    const listener = () =>
      setTimeout(() => onHiddenStatusChange(document.hidden));

    onMounted(() => {
      differencePlatformEvents.forEach(event => {
        document.addEventListener(event, listener);
      });
    });

    onUnmounted(() => {
      differencePlatformEvents.forEach(event => {
        document.removeEventListener(event, listener);
      });
    });
  } else {
    throw new Error(
      'Invalid hook call: `useBrowserTabChange` can only be called inside of `setup()`.',
    );
  }
}
