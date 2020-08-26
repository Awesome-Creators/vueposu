/**
 * useFavicon - change site icon
 * @param url favicon url
 */
export default function useFavicon(url) {
  const link: HTMLLinkElement =
    document.querySelector("link[rel*='icon']") ||
    document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = url;
  document.getElementsByTagName('head')[0].appendChild(link);
}
