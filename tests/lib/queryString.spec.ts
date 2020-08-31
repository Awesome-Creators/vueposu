import queryString from '../../src/lib/queryString';

const { parse, stringify } = queryString;

describe('queryString.parse', () => {
  it('should be parsed the string to a query object', () => {
    const q = '?a=1&b=2';
    expect(parse(q)).toEqual({ a: '1', b: '2' });
  });
});

describe('queryString.stringify', () => {
  it('should be parsed the object to a query string', () => {
    const q = { a: 1, b: 2 };
    expect(stringify(q)).toEqual('a=1&b=2');
  });
});
