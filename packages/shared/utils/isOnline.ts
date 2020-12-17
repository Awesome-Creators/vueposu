/* istanbul ignore file */
import { isUndefined } from './helper';

export default function isOnline() {
  if (!isUndefined(navigator.onLine)) {
    return navigator.onLine;
  }
  // always assume it's online.
  return true;
}
