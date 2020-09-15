import useEffect from './useEffect';

let someUsedIsUnmounted = false;

/**
 * set the string to the page title.
 *
 * @param title The string to set to the page title.
 * @param callback callback function when set the page title.
 */
export default function useTitle(title: string, callback?: () => void) {
  title = String(title);
  let used = false;

  useEffect(() => {
    if (someUsedIsUnmounted) {
      someUsedIsUnmounted = false;
      used = false;
    }
    if (!used) {
      used = true;
      document.title = title;
      callback && callback();
    }

    return () => {
      someUsedIsUnmounted = true;
    };
  });
}
