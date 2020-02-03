exports.actual = `
false ? foo : bar;
`;

exports.expected = `
bar;
`;
