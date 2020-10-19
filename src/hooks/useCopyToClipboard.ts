import { ref } from 'vue-demi';
import type { Ref } from 'vue-demi';

// TODO: COMMENT NEED
export type UseCopyToClipboardReturnType = {
  copy: (text: string) => Promise<void>;
  text: Ref<string>;
  supportCopy: boolean;
};

export default function useCopyToClipboard(): UseCopyToClipboardReturnType {
  const text = ref('');
  const supportCopy = 'clipboard' in window.navigator;

  const copy = ($text: string) => {
    text.value = $text;
    return window.navigator.clipboard.writeText($text);
  };

  return { copy, text, supportCopy };
}
