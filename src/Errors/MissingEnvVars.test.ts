import MissingEnvVars, {defaultMsg} from "./MissingEnvVars";

test('message has default msg when none supplied', () => {
    const missingEnvVars = new MissingEnvVars();
    expect(missingEnvVars.message).toEqual(defaultMsg);
});

test('obj.message = supplied message', () => {
    const msg = 'err';
    const missingEnvVars = new MissingEnvVars(msg);
    expect(missingEnvVars.message).toEqual(msg);
});
