const protectController = jest.fn((controllerFunc, isAdmin) => {
   return controllerFunc;
});

export default protectController;
