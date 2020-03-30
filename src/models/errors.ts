export class QueryError extends Error{
    constructor(msg?: string) {
        if (!msg) {
            super('Failed to make query');
        } else {
            super(msg);
        }
    }
}

