
export interface IPropAssertion {
    type: string | string[];
    isRequired: boolean;
}

export interface IObjShape {
    [index: string]: IPropAssertion;
    [index: number]: IPropAssertion;
}

export default function hasShape(object: any, propAssertions: IObjShape): boolean {
    if (typeof object !== 'object') {
        return false;
    }
    const obj = {...object};
    const propAsserts: IObjShape = {...propAssertions};

    try {

        Object.keys(obj).forEach((key: string | number) => {
            const assertion: IPropAssertion  = propAsserts[key];
            if (!assertion) {
                return;
            }
            // type is of single value
            if (typeof assertion.type === 'string') {
                if (typeof obj[key] !== assertion.type) {
                    throw {};
                }
            } else {
                let foundTypeMatch = false;
                assertion.type.forEach(type => {
                    if (typeof obj[key] === type) {
                        foundTypeMatch = true;
                    }
                });
                if (!foundTypeMatch) {
                    throw {};
                }
            }
            delete propAsserts[key];
            delete obj[key];
        });

        // tslint:disable-next-line:forin
        for (const key in propAsserts) {

            if (propAsserts[key].isRequired) {
                return false;
            }
            delete propAsserts[key];
        }

        if (Object.keys(obj).length !== 0) {
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
}
