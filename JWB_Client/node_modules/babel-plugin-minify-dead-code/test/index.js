const fs = require('fs');
const babel = require('babel-core');
const diff = require('diff');
const chalk = require('chalk');

const pluginPath = require.resolve('..');

function normalizeLines(str) {
    return str.trim();
}

function toErrorStack(err) {
    if (err._babel && err instanceof SyntaxError) {
        return `${err.name}: ${err.message}\n${err.codeFrame}`;
    } else {
        return err.stack;
    }
}

const tests = process.argv[2] ? [process.argv[2]]
    : fs.readdirSync(__dirname + '/tests').filter(name => name.endsWith('.js'));

tests.forEach(filename => {
    const test = require(__dirname + '/tests/' + filename);

    try {
        const output = babel.transform(test.actual, {
            babelrc: false,
            presets: [],
            plugins: [
                [pluginPath],
            ],
        });

        const actual = output.code.trim();
        const expected = test.expected.trim();

        if (actual !== expected) {
            console.log(`Failed test: ${test.name || filename}`);

            diff.diffLines(actual, expected).forEach(part => {
                let value = part.value;
                if (part.added) {
                    value = chalk.green(part.value);
                } else if (part.removed) {
                    value = chalk.red(part.value);
                }
                process.stdout.write(value);
            });

            console.log('');
            process.exit(1);
        }
    } catch (err) {
        console.log(`Unexpected error in test: ${test.name || filename}`);

        console.log(toErrorStack(err));
        process.exit(1);
    }
});

console.log(`${tests.length} tests`);
