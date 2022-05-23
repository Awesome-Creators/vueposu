/* istanbul ignore file */
import { isUndefined, isServer } from '@vueposu/utils';

export function isDocumentVisible() {
  if (!isServer && !isUndefined(document.visibilityState)) {
    return document.visibilityState !== 'hidden';
  }
  // always assume it's visible.
  return true;
}
