import { ref, getCurrentInstance } from 'vue-demi';
import useEventListener from './useEventListener';

import type { Ref } from 'vue-demi';

// TODO: COMMENT NEED
export type UseClipboardReturnType = {
  copy: (text: string) => Promise<void>;
  text: Ref<string>;
  supported: boolean;
};

export default function useClipboard(): UseClipboardReturnType {
  if (getCurrentInstance()) {
    const text = ref('');
    const supported = 'clipboard' in window.navigator;

    const getClipboardText = async () => {
      text.value = await window.navigator.clipboard.readText();
    };

    getClipboardText();
    useEventListener('focus', getClipboardText);
    useEventListener('copy', getClipboardText);

    const copy = ($text: string) => {
      text.value = $text;
      return window.navigator.clipboard.writeText($text);
    };

    return { copy, text, supported };
  } else {
    throw new Error(
      'Invalid hook call: `useClipboard` can only be called inside of `setup()`.',
    );
  }
}
