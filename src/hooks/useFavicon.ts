/**
 * useFavicon - change site icon
 * @param url favicon url
 */
export default function useFavicon(url?: string) {
  // change site favicon
  const changeIcon = ($url: string) => {
    if ($url) {
      const link: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = $url;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  };

  // if has url, immediately update icon
  if (url) changeIcon(url);

  // export changeIcon
  return [changeIcon];
}
