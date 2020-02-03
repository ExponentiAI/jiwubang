exports.actual = `
if (foo) {
} else {
    bar;
}
`;

exports.expected = `
if (!foo) {
    bar;
}
`;
