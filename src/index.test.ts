import startServer from "./server";
import './index';
jest.mock('./server');


test('startServer gets called', () => {
   expect(startServer).toBeCalledTimes(1);
});

