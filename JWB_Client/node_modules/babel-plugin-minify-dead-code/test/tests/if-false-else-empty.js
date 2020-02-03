exports.actual = `
if (false) {
    foo;
} else {
    bar;
}
`;

exports.expected = `
{
    bar;
}
`;
