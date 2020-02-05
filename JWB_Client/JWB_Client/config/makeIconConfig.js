const fs = require('fs');
const path = require('path');
const camelCase = require('camelcase');

const IconPath = path.join(__dirname, '../', 'src/assets/images/icon');

let filesName = fs.readdirSync(IconPath).filter(file => file !== 'index.js');

let files = filesName.map(file => ({
    baseName: path.basename(file, path.extname(file)),
    fileName: file
}));

function makeImport() {
    let str = '';
    files.forEach(item => {
        str += `import ${camelCase(item.baseName)} from './${item.fileName}';\n`;
    });
    return str;
}

function makeExport() {
    let str = `export { \n`;
    files.forEach(item => {
        str += `    ${camelCase(item.baseName)},\n`;
    });
    return `${str} \n}`;
}

fs.writeFileSync(path.join(IconPath, 'index.js'), `${makeImport()}\n${makeExport()}`);
