exports.actual = `
if (false) {
    foo;
} else if (foo) {
    bar;
} else {
    foobar;
}
`;

exports.expected = `
if (foo) {
    bar;
} else {
    foobar;
}
`;
