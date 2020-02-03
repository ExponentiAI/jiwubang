exports.actual = `
if (foo) {
    foo;
} else {
}
`;

exports.expected = `
if (foo) {
    foo;
}
`;
