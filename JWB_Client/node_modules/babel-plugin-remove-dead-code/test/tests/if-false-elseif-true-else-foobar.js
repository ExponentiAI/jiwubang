exports.actual = `
if (false) {
    foo;
} else if (true) {
    bar;
} else {
    foobar;
}
`;

exports.expected = `
{
    bar;
}
`;
