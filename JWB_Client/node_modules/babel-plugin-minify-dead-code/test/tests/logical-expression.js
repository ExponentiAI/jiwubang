exports.actual = `
false && foo;
true && foo;
`;

exports.expected = `
false;
foo;
`;
