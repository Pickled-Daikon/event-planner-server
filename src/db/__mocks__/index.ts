const findOne = jest.fn(() => new Promise((resolve => resolve())));
const find = jest.fn(() => new Promise((resolve => resolve())));
const insertOne = jest.fn(() => new Promise((resolve => resolve({
    insertedCount: 1,
    ops: [{}],
}))));
export const collection = jest.fn(() => {
    return {
        find,
        findOne,
        insertOne
    }
});

export const connect = jest.fn(() => {});

export const getDb = jest.fn(() => ({
    collection,
}));
