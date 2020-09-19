import { onBeforeUnmount, ref } from 'vue-demi';

export function useClipboard() {
  const text = ref('');
  const supportCopy = ref('clipboard' in window.navigator);
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

  return {
    text,
    copy,
    supportCopy,
  };
}
