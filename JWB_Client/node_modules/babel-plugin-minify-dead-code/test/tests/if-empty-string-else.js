exports.actual = `
if ("") {
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


