type AnyObject = { [key: string]: any };

export function parse(s: string): AnyObject {
  const query = {};
  if (s) {
    s.replace(/[?|#]/, '')
      .split('&')
      .forEach(e => {
        const [key, value] = e.split('=');
        if (key) {
          query[key] = value;
        }
      });
  }
  return query;
}

export function stringify(q: AnyObject): string {
  let queryString = '';
  if (Object.prototype.toString.call(q) === '[object Object]') {
    Object.entries(q).forEach(([key, value]) => {
      queryString += `${key}=${value}&`;
    });
    queryString = queryString.slice(0, queryString.length - 1);
  }
  return queryString;
}

export default {
  parse,
  stringify,
};
