/* istanbul ignore file */

// TODO: COMMENT NEED
export default function useRequest(url: string, init?: RequestInit) {
  return fetch(url, init).then(res => res.json());
}