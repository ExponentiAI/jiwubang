exports.actual = `
true ? foo : bar;
`;

exports.expected = `
foo;
`;
