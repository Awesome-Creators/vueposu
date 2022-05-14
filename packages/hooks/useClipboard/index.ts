import { ref } from 'vue-demi';
import { useEventListener } from 'vueposu';
import { isServer } from '@vueposu/utils';

import type { Ref } from 'vue-demi';

// TODO: COMMENT NEED
export type UseClipboardReturnType = {
  copy: (text: string) => Promise<void>;
  text: Ref<string>;
  supported: boolean;
};

export function useClipboard(): UseClipboardReturnType {
  const text = ref('');
  const supported = !isServer && 'clipboard' in window.navigator;

  const getClipboardText = async () => {
    if (!isServer) {
      text.value = await window.navigator.clipboard.readText();
    }
  };

  getClipboardText();
  useEventListener('focus', getClipboardText);
  useEventListener('copy', getClipboardText);

  const copy = ($text: string) => {
    text.value = $text;
    return isServer
      ? new Promise<void>(() => {})
      : window?.navigator?.clipboard?.writeText?.($text);
  };

  return { copy, text, supported };
}
