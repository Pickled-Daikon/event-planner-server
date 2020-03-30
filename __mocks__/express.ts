
export const use = jest.fn(() => {});
export const json = jest.fn(() => {});
export const listen = jest.fn(() => {});
export const Router = jest.fn(() => {});


const mock = jest.fn().mockImplementation(() => {
    // @ts-ignore
    this.default.json = json;
    // @ts-ignore
    this.default.use = use;
    // @ts-ignore
    this.default.Router = Router;

    return {
        use,
        listen,
    };
});

mock.prototype.json = json;

export default mock;
