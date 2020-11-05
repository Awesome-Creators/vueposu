import { getCurrentInstance } from 'vue-demi';
import { isServer } from '../libs/helper';

/**
 * useFavicon - change site icon
 *
 * @param url favicon url
 */
export default function useFavicon(url?: string) {
  if (getCurrentInstance()) {
    if (isServer) return { changeIcon: () => null, restoreIcon: () => null };

    let link: HTMLLinkElement = document.querySelector("link[rel*='icon']");
    let originalIcon = '';
    if (link) {
      originalIcon = link.href;
    } else {
      link = document.createElement('link');
    }
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';

    // change site favicon
    const changeIcon = ($url: string) => {
      if ($url) {
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
  } else {
    throw new Error(
      'Invalid hook call: `useFavicon` can only be called inside of `setup()`.',
    );
  }
}
