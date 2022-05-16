/* istanbul ignore file */
import { isUndefined } from '@vueposu/utils';

export function isOnline() {
  if (!isUndefined(navigator.onLine)) {
    return navigator.onLine;
  }
  // always assume it's online.
  return true;
}
