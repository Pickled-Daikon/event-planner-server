import startServer from "./server";

startServer().catch((e: Error) => {
    // tslint:disable-next-line:no-console
    console.log('Fatal server error.');
    // tslint:disable-next-line:no-console
    console.log(e);
});
