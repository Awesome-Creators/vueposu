/* istanbul ignore file */
import { isUndefined } from './helper';

export default function isDocumentVisible() {
  if (!isUndefined(document) && !isUndefined(document.visibilityState)) {
    return document.visibilityState !== 'hidden';
  }
  // always assume it's visible.
  return true;
}
