import { getCurrentInstance, shallowRef, watchEffect, onUnmounted } from 'vue';

interface ITitleState {
  current?: {
    title: string;
    instance_uid?: number;
  };
  before?: ITitleState;
}

const defaultTitle = document.title;

const titleState = shallowRef<ITitleState>({});
const currentInstance = shallowRef<{ uid?: number }>({});

const queue = [];
let handling = false;

function handleQueue() {
  handling = true;
  setTimeout(() => {
    handler();
  });
}

function handler() {
  handling = false;
  if (currentInstance.value.uid) {
    if (queue.length > 0) {
      if (!titleState.value.current) {
        titleState.value.current = {
          title: queue[0].before,
          instance_uid: currentInstance.value.uid,
        };
      }
      const before = { ...titleState.value };
      titleState.value.current = {
        title: queue[queue.length - 1].current,
        instance_uid: currentInstance.value.uid,
      };
      titleState.value.before = before;
      setTitle(titleState.value.current.title);
    }
    queue.length = 0;
  } else {
    queue.length = 0;
    throw new Error(
      'Invalid hook call. Hooks can only be called inside of `setup()`.',
    );
  }
}

function setTitle(title: string) {
  if (title !== document.title) {
    document.title = title;
  }
  if (title === defaultTitle) {
    delete titleState.value.current;
    delete titleState.value.before;
  }
}

/**
 * useTitle function
 *
 * @param title The string to set to the page title.
 */
async function useTitle(title: string) {
  title = String(title);
  const instance = getCurrentInstance();

  currentInstance.value.uid = instance?.uid;

  watchEffect(() => {
    try {
      if (
        queue.length > 0 &&
        currentInstance.value.uid !== queue[queue.length - 1]?.instance_uid
      ) {
        handler();
      }

      queue.push({
        before: document.title,
        current: title,
        instance_uid: currentInstance.value.uid,
      });

      if (!handling) {
        handleQueue();
      }
    } catch (err) {}
  });

  if (instance) {
    onUnmounted(() => {
      if (title === titleState.value?.current?.title) {
        titleState.value = titleState.value.before;
        setTitle(titleState.value.current.title);
      }
    });
  }
}

export default useTitle;
