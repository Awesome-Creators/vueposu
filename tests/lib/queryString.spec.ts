import queryString from '../../src/lib/queryString';

const { parse, stringify } = queryString;

describe('queryString.parse', () => {
  it('should be parsed the string to a query object', () => {
    const q = '?a=1&b=2';
    expect(parse(q)).toEqual({ a: '1', b: '2' });

    const q2 = 'a=0&b=undefined';
    expect(parse(q2)).toEqual({ a: '0', b: 'undefined' });

    const q3 = 'a=true&b=false';
    expect(parse(q3)).toEqual({ a: 'true', b: 'false' });
  });
});

describe('queryString.stringify', () => {
  it('should be parsed the object to a query string', () => {
    const q = { a: 1, b: 2 };
    expect(stringify(q)).toEqual('a=1&b=2');

    const q2 = { a: 0, b: undefined };
    expect(stringify(q2)).toEqual('a=0&b=undefined');

    const q3 = { a: true, b: false };
    expect(stringify(q3)).toEqual('a=true&b=false');
  });
});
