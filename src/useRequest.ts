// TODO: ...

import { reactive } from 'vue';

interface IResponse {
  data: any;
  error: boolean;
  loading: boolean;
}

function useRequest(instance): IResponse {
  const response = reactive<IResponse>({
    data: undefined,
    error: false,
    loading: true,
  });
  if (Object.prototype.toString.call(instance) === '[object Promise]') {
  } else {
  }

  return response;
}

export default useRequest;
