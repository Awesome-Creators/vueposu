import { isServer } from '@vueposu/utils';

type UseFaviconReturnType = {
  changeIcon: (url: string) => void;
  restoreIcon: () => void;
}

/**
 * useFavicon - change site icon
 *
 * @param url favicon url
 */
export function useFavicon(url?: string): UseFaviconReturnType {
  if (isServer) return { changeIcon: () => null, restoreIcon: () => null };

  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  let originalIcon = '';
  if (link) {
    originalIcon = link.href;
  } else {
    link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    document.head.appendChild(link);
  }

  // change site favicon
  const changeIcon = ($url: string) => {
    if (link && $url) {
      link.href = $url;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  };

  // restore favicon if it has the original icon
  const restoreIcon = () => {
    if (originalIcon) {
      changeIcon(originalIcon);
    }
  };

  // if has url, immediately update icon
  if (url) changeIcon(url);

  return { changeIcon, restoreIcon };
}
