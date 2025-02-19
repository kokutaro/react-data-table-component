import {
  sort,
  getProperty,
  insertItem,
  removeItem,
  decorateColumns,
  getSortDirection,
  handleFunctionProps,
  getConditionalStyle,
  // updateSelectedRows,
  isRowSelected,
} from '../util';

const row = Object.freeze({ id: 1, name: 'iamaname', properties: { nested: 'iamnesting', items: [{ id: 1, name: 'iamarrayname' }] } });

describe('sort', () => {
  test('built in sort', () => {
    const rows = sort([{ name: 'luke' }, { name: 'vadar' }], 'name', 'desc');

    expect(rows[0].name).toEqual('vadar');
  });

  test('should handle a null field and not sort', () => {
    const rows = sort([{ name: 'luke' }, { name: 'vadar' }], null, 'desc');

    expect(rows[0].name).toEqual('luke');
  });

  test('custom sort should be called', () => {
    const mockSort = jest.fn();

    sort([{ name: 'luke' }, { name: 'vadar' }], 'name', 'desc', mockSort);

    expect(mockSort).toBeCalledWith([{ name: 'luke' }, { name: 'vadar' }], 'name', 'desc');
  });

  test('should handle when field is empty', () => {
    const rows = sort([{ name: 'luke' }, { name: 'vadar' }], undefined, 'asc');

    expect(rows[0].name).toEqual('luke');
  });
});

describe('getProperty', () => {
  test('getProperty return a value when a string selector is passed', () => {
    const property = getProperty(row, 'name');

    expect(property).toEqual('iamaname');
  });

  test('getProperty return a value when there is a nested string selector', () => {
    const property = getProperty(row, 'properties.nested');

    expect(property).toEqual('iamnesting');
  });

  test('getProperty return a value when a string selector is an array', () => {
    const property = getProperty(row, 'properties.items[0].name');

    expect(property).toEqual('iamarrayname');
  });

  test('getProperty sreturn a value when a string selector is an function', () => {
    const property = getProperty(row, r => r.name);

    expect(property).toEqual('iamaname');
  });

  test('getProperty should handle when a format function is passed', () => {
    const property = getProperty(row, 'name', r => r.name.toUpperCase());

    expect(property).toEqual('IAMANAME');
  });

  test('getProperty should throw an error if the selector is not a string or function', () => {
    expect(() => getProperty(row, { data: 'incorrect' })).toThrow();
  });
});

describe('insertItem', () => {
  test('should return the correct array items', () => {
    const array = insertItem([{ name: 'foo' }], { name: 'bar' });

    expect(array).toEqual([{ name: 'bar' }, { name: 'foo' }]);
  });
});

describe('removeItem', () => {
  test('should return the correct array items', () => {
    const array = removeItem([{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }], { id: 2, name: 'bar' }, 'id');

    expect(array).toEqual([{ id: 1, name: 'foo' }]);
  });

  test('should return the correct array items when no keyfield is provided', () => {
    const array = removeItem([{ name: 'foo' }, { name: 'bar' }], { name: 'bar' });

    expect(array).toEqual([{ name: 'foo' }]);
  });

  test('should fallback to referne check is the keyField is mismatched', () => {
    const array = removeItem([{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }], { id: 2, name: 'bar' }, 'UUID');

    expect(array).toEqual([{ id: 1, name: 'foo' }]);
  });
});

describe('decorateColumns', () => {
  test('should proeprty decorate columms', () => {
    const array = decorateColumns([{ name: 'foo' }, { name: 'bar' }]);

    expect(array[0]).toHaveProperty('id');
    expect(array[1]).toHaveProperty('id');
  });
});

describe('getSortDirection', () => {
  test('should return asc if true', () => {
    const direction = getSortDirection(true);

    expect(direction).toBe('asc');
  });

  test('countIfOne should return desc if false', () => {
    const direction = getSortDirection();

    expect(direction).toBe('desc');
  });
});

describe('handleFunctionProps', () => {
  test('should resolve the property if it is a function with indeterminate = true', () => {
    const prop = handleFunctionProps({ fakeProp: indeterminate => (indeterminate ? 'yay' : 'nay') }, true);

    expect(prop).toEqual({ fakeProp: 'yay' });
  });

  test('should resolve the property if it is a function with indeterminate = false', () => {
    const prop = handleFunctionProps({ fakeProp: indeterminate => (indeterminate ? 'yay' : 'nay') }, false);

    expect(prop).toEqual({ fakeProp: 'nay' });
  });

  test('should not need to resolve the property if it is not a function', () => {
    const prop = handleFunctionProps({ fakeProp: 'haha' });

    expect(prop).toEqual({ fakeProp: 'haha' });
  });
});


describe('getConditionalStyle', () => {
  test('should return a row style if the expression matches', () => {
    const rowStyleExpression = [
      {
        when: r => r.name === 'luke',
        style: {
          backgroundColor: 'green',
        },
      },
    ];

    const style = getConditionalStyle({ name: 'luke' }, rowStyleExpression);

    expect(style).toEqual({ backgroundColor: 'green' });
  });

  test('should return {} if the expression does not match', () => {
    const rowStyleExpression = [
      {
        when: r => r.name === 'wookie',
        style: {
          backgroundColor: 'green',
        },
      },
    ];

    const style = getConditionalStyle({ name: 'luke' }, rowStyleExpression);

    expect(style).toEqual({});
  });

  test('should return {} if there are no style object expressions', () => {
    const rowStyleExpression = [];

    const style = getConditionalStyle({ name: 'luke' }, rowStyleExpression);

    expect(style).toEqual({});
  });

  test('should default to an empty object if the style property is not provided', () => {
    const rowStyleExpression = [
      {
        when: r => r.name === 'luke',
      },
    ];

    const style = getConditionalStyle({ name: 'luke' }, rowStyleExpression);

    expect(style).toEqual({});
  });

  test('should throw an error if the when expression is not a function', () => {
    const rowStyleExpression = [
      {
        when: 'poopy',
        style: {
          backgroundColor: 'green',
        },
      },
    ];

    expect(() => getConditionalStyle({ name: 'luke' }, rowStyleExpression)).toThrow();
  });

  test('should throw an error if the when property is not provided', () => {
    const rowStyleExpression = [
      {
        style: {
          backgroundColor: 'green',
        },
      },
    ];

    expect(() => getConditionalStyle({ name: 'luke' }, rowStyleExpression)).toThrow();
  });

  test('with default values', () => {
    expect(getConditionalStyle()).toEqual({});
  });
});

describe('isRowSelected', () => {
  test('when there is a keyField in the data set', () => {
    const currentRow = { id: 2, name: 'vadar' };
    const selectedRows = [{ id: 1, name: 'luke' }, { id: 2, name: 'vadar' }];

    expect(isRowSelected(currentRow, selectedRows, 'id')).toBe(true);
  });

  test('when the keyField is missing in the data set', () => {
    const selectedRows = [{ name: 'luke' }, { name: 'vadar' }];
    const currentRow = selectedRows[1];

    expect(isRowSelected(currentRow, selectedRows, 'id')).toBe(true);
  });

  test('when the row is not selected', () => {
    const currentRow = { id: 3, name: 'leia' };
    const selectedRows = [{ id: 1, name: 'luke' }, { id: 2, name: 'vadar' }];

    expect(isRowSelected(currentRow, selectedRows, 'id')).toBe(false);
  });

  test('with default values', () => {
    expect(isRowSelected()).toBe(false);
  });
});
