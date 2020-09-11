import { getCurrentInstance } from 'vue';
import useEffect from './useEffect';

interface ITitleState {
  before: string;
  current: string;
}

const titleMap = new Map<number, ITitleState>();

/**
 * set the string to the page title.
 *
 * @param title The string to set to the page title.
 * @param callback callback function when set the page title.
 */

export default function useTitle(title: string, callback?: () => void) {
  title = String(title);
  const instance = getCurrentInstance();

  if (instance) {
    if (document.title !== title) {
      let t = titleMap.get(instance.uid);

      if (!t) {
        titleMap.set(instance.uid, (t = {} as ITitleState));
      }

      if (!t.before) {
        t.before = document.title;
      }

      if (t.current !== title) {
        t.current = title;

        useEffect(() => {
          document.title = t.current;
          callback && callback();

          return () => {
            document.title = t.before;
            titleMap.delete(instance.uid);
          };
        }, [t]);
      }
    }
  } else {
    throw new Error(
      'Invalid hook call. Hooks can only be called inside of `setup()`.',
    );
  }
}
