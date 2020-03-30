import {QueryError} from "./errors";

test('query error uses default msg if non is given', () => {
   const qError = new QueryError();
   expect(qError.message).toEqual('Failed to make query');
});

test('query error uses msg given in constructor', () => {
   const msg = 'bla';
   const qError = new QueryError(msg);
   expect(qError.message).toEqual(msg);
});
