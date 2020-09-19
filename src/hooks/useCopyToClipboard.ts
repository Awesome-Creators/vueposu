import { ref } from 'vue-demi';

export function useClipboard() {
  const text = ref('');
  const supportCopy = ref('clipboard' in window.navigator);

  window.addEventListener('copy', async () => {
    text.value = await window.navigator.clipboard.readText();
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
