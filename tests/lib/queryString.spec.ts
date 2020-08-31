import queryString from '../../src/lib/queryString';

const { parse, stringify } = queryString;

describe('queryString.parse', () => {
  it('query strings starting with a `?`', () => {
    const q = '?a=1&b=2';
    expect(parse(q)).toEqual({ a: '1', b: '2' });

    const q2 = '?a=0&b=undefined';
    expect(parse(q2)).toEqual({ a: '0', b: 'undefined' });

    const q3 = '?a=true&b=false';
    expect(parse(q3)).toEqual({ a: 'true', b: 'false' });

    const q4 = `?a=true&b=https://www.test.com`;
    expect(parse(q4)).toEqual({ a: 'true', b: 'https://www.test.com' });
  });

  it('query strings starting with a `#`', () => {
    const q = `#a=true`;
    expect(parse(q)).toEqual({ a: 'true' });

    const q2 = '#a=0&b=undefined';
    expect(parse(q2)).toEqual({ a: '0', b: 'undefined' });

    const q3 = '#a=true&b=false';
    expect(parse(q3)).toEqual({ a: 'true', b: 'false' });

    const q4 = `#a=true&b=https://www.test.com`;
    expect(parse(q4)).toEqual({ a: 'true', b: 'https://www.test.com' });
  });

  it('query strings starting with a `&`', () => {
    const q = `&a=true`;
    expect(parse(q)).toEqual({ a: 'true' });

    const q2 = '&a=0&b=undefined';
    expect(parse(q2)).toEqual({ a: '0', b: 'undefined' });

    const q3 = '&a=true&b=false';
    expect(parse(q3)).toEqual({ a: 'true', b: 'false' });

    const q4 = `&a=true&b=https://www.test.com`;
    expect(parse(q4)).toEqual({ a: 'true', b: 'https://www.test.com' });
  });

  it('return empty object if no qss can be found', () => {
    expect(parse('?')).toEqual({});
    expect(parse('&')).toEqual({});
    expect(parse('#')).toEqual({});
    expect(parse(' ')).toEqual({});
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

    const q4 = {
      c: 'foo',
      b: 'bar',
      a: 'baz',
    };
    expect(stringify(q4)).toEqual('c=foo&b=bar&a=baz');

    const q5 = {
      a: 1,
      b: null,
      c: 3,
    };

    expect(stringify(q5)).toEqual('a=1&b=null&c=3');
  });
});
