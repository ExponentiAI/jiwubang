exports.actual = `
if (true) {
    foo;
} else if (false) {
    bar;
}
`;

exports.expected = `
{
    foo;
}
`;
