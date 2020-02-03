"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const memFs = require("mem-fs");
const editor = require("mem-fs-editor");
const _ = require("lodash");
const util_1 = require("../util");
class Creator {
    constructor(sourceRoot) {
        const store = memFs.create();
        this.fs = editor.create(store);
        this.sourceRoot(sourceRoot || path.join(util_1.getRootPath()));
        this.init();
    }
    init() { }
    sourceRoot(rootPath) {
        if (typeof rootPath === 'string') {
            this._rootPath = path.resolve(rootPath);
        }
        if (!fs.existsSync(this._rootPath)) {
            fs.ensureDirSync(this._rootPath);
        }
        return this._rootPath;
    }
    templatePath(...args) {
        let filepath = path.join.apply(path, args);
        if (!path.isAbsolute(filepath)) {
            filepath = path.join(this._rootPath, 'templates', filepath);
        }
        return filepath;
    }
    destinationRoot(rootPath) {
        if (typeof rootPath === 'string') {
            this._destinationRoot = path.resolve(rootPath);
            if (!fs.existsSync(rootPath)) {
                fs.ensureDirSync(rootPath);
            }
            process.chdir(rootPath);
        }
        return this._destinationRoot || process.cwd();
    }
    destinationPath(...args) {
        let filepath = path.join.apply(path, args);
        if (!path.isAbsolute(filepath)) {
            filepath = path.join(this.destinationRoot(), filepath);
        }
        return filepath;
    }
    template(template, source, dest, data, options) {
        if (typeof dest !== 'string') {
            options = data;
            data = dest;
            dest = source;
        }
        const src = this.templatePath(template, source);
        if (!fs.existsSync(src))
            return;
        this.fs.copyTpl(src, this.destinationPath(dest), Object.assign({ _ }, this, data), options);
        return this;
    }
    writeGitKeepFile(dirname) {
        dirname = path.resolve(dirname);
        fs.writeFileSync(path.join(dirname, '.gitkeep'), 'Place hold file', 'utf8');
    }
    write() { }
}
exports.default = Creator;
