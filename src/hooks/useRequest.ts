import { reactive } from 'vue';
import { stringify } from '@lib/queryString';

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

interface IRequestInstance {
  url?: string;
  method?: Method;
  params?: any;
  data?: any;
  headers?: any;
}

interface IResponse<T = any> {
  data: T;
  error: boolean;
  loading: boolean;
}

function useRequest<T = any>(service: any = {}): IResponse<T> {
  const response = reactive<IResponse>({
    data: undefined,
    error: false,
    loading: true,
  });

  if (typeof service === 'function') {
    service;
  } else if (Object.prototype.toString.call(service) === '[object Object]') {
    let {
      url = '',
      method = 'GET',
      params = {},
      data = {},
      headers = {},
    } = service as IRequestInstance;

    const options = {
      method,
      headers: new Headers(headers),
    } as any;

    if (method.toUpperCase() === 'GET') {
      url = url.replace('?', '') + '?' + stringify(params);
    } else {
      options.body = JSON.stringify(data);
    }

    window
      .fetch(url, options)
      .then(res => {
        return res.json();
      })
      .catch(err => {
        response.loading = false;
        response.error = true;
        // throw Error(`[useRequest]: ${err}`);
      });
  }

  return response;
}

export default useRequest;
