import { onBeforeUnmount, ref } from 'vue-demi';
import type { Ref } from 'vue-demi';

export type useCopyToClipboard = [
  copy: (txt: string) => Promise<void>,
  text: Ref<string>,
  supportCopy: boolean,
];

export default function useCopyToClipboard(): useCopyToClipboard {
  const text = ref('');
  const supportCopy = 'clipboard' in window.navigator;
  const copyToClipboard = async () => {
    text.value = await window.navigator.clipboard.readText();
  };

  window.addEventListener('copy', copyToClipboard);

  onBeforeUnmount(() => {
    window.removeEventListener('copy', copyToClipboard);
  });

  function copy(txt: string) {
    text.value = txt;
    return window.navigator.clipboard.writeText(txt);
  }

  return [copy, text, supportCopy];
}
