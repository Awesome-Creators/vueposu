import { onMounted, onBeforeUnmount, getCurrentInstance } from 'vue-demi';
import { isFunction } from '../libs/helper';

// the difference platfrom listen
const DIFFERENCE_PLATFORM_EVT = [
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
 * @param onHiddenStatusChange function for useBrowserTabChange
 */
export default function useBrowserTabChange(
  onHiddenStatusChange: (isHidden?: boolean) => void,
) {
  if (getCurrentInstance()) {
    const listener = () => setTimeout(() => onHiddenStatusChange(document.hidden));

    onMounted(() => {
      DIFFERENCE_PLATFORM_EVT.forEach(evt => {
        document.addEventListener(evt, listener);
      });
    });

    onBeforeUnmount(() => {
      DIFFERENCE_PLATFORM_EVT.forEach(evt => {
        document.removeEventListener(evt, listener);
      });
    });
  } else {
    throw new Error(
      'Invalid hook call: `useBrowserTabChange` can only be called inside of `setup()`.',
    );
  }
}
