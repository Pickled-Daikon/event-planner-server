export const defaultMsg = 'Missing environment variables';

export default class MissingEnvVars extends Error {
    constructor(msg?: string) {
        if (!msg) {
            super(defaultMsg);
        } else {
            super(msg);
        }
    }
}

const bla = new Error;
bla.message

const fa = new MissingEnvVars();
fa.message
