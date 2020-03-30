import hasShape from "./hasShape";

test('non-objects return false', () => {
   expect(hasShape(2, {})).toEqual(false);
});

test('missing prop returns false', () => {
    const obj = {};
    const propAssertions = {'foo': {isRequired: true, type: 'string'}};
   expect(hasShape(obj, propAssertions)).toEqual(false);
});

test('incorrect prop type returns false', () => {
   const obj = {foo: 'someString'};
   const propAssertions = {'foo': {isRequired: true, type: 'number'}};
   expect(hasShape(obj, propAssertions)).toEqual(false);
});

test('object with extra props return false', () => {
   const obj = {foo: 'bar'};
   const propAssertions = {};
   expect(hasShape({}, propAssertions)).toEqual(true);
   expect(hasShape(obj, propAssertions)).toEqual(false);
});

test('object missing non required prop returns true', () => {
    const obj = {};
    const propAssertions = {'foo': {type: 'number', isRequired: false}};
    expect(hasShape(obj, propAssertions)).toEqual(true);
});

test('object of correct shape returns true', () => {
    const obj = {foo: 'bar'};

    // test when required type is single value
    const propAssertions1 = {'foo': {isRequired: true, type: 'string'}};

    // test when required type is a list of values
    const propAssertions2 = {'foo': {isRequired: true, type: ['number', 'string']}};

    expect(hasShape(obj, propAssertions1)).toEqual(true);
    expect(hasShape(obj, propAssertions2)).toEqual(true);

});
