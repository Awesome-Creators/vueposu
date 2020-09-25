import { ref } from 'vue-demi';
import type { Ref } from 'vue-demi';

export type useCopyToClipboard = [
  copy: (txt: string) => Promise<void>,
  text: Ref<string>,
  supportCopy: boolean,
];

export default function useCopyToClipboard(): useCopyToClipboard {
  const text = ref('');
  const supportCopy = 'clipboard' in window.navigator;

  const copy = (txt: string) => {
    text.value = txt;
    return window.navigator.clipboard.writeText(txt);
  };

  return [copy, text, supportCopy];
}
