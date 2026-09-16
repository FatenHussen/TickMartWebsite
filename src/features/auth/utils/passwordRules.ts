const PASSWORD_RULES = {
    minLength: 8,
    lower: /[a-z]/,
    upper: /[A-Z]/,
    digit: /\d/,
    symbol: /[^A-Za-z0-9]/,
};

export function isStrongPassword(password: string): boolean {
    return (
        password.length >= PASSWORD_RULES.minLength &&
        PASSWORD_RULES.lower.test(password) &&
        PASSWORD_RULES.upper.test(password) &&
        PASSWORD_RULES.digit.test(password) &&
        PASSWORD_RULES.symbol.test(password)
    );
}
