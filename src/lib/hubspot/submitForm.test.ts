import { splitFullName } from './submitForm';

describe('splitFullName', () => {
  it('splits first and last', () => {
    expect(splitFullName('Jane Doe')).toEqual({
      firstname: 'Jane',
      lastname: 'Doe',
    });
  });

  it('handles single token', () => {
    expect(splitFullName('Madonna')).toEqual({
      firstname: 'Madonna',
      lastname: '',
    });
  });

  it('trims and keeps rest as lastname', () => {
    expect(splitFullName('  A B C  ')).toEqual({
      firstname: 'A',
      lastname: 'B C',
    });
  });
});
