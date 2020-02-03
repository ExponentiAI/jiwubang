"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const chalk_1 = require("chalk");
const ora = require("ora");
const AdmZip = require("adm-zip");
const download = require("download-git-repo");
const request = require("request");
const util_1 = require("../util");
const TEMP_DOWNLOAD_FLODER = 'taro-temp';
function fetchTemplate(templateSource, templateRootPath, clone) {
    const type = util_1.getTemplateSourceType(templateSource);
    const tempPath = path.join(templateRootPath, TEMP_DOWNLOAD_FLODER);
    let name;
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        // 下载文件的缓存目录
        if (fs.existsSync(tempPath))
            yield fs.remove(tempPath);
        yield fs.mkdir(tempPath);
        const spinner = ora(`正在从 ${templateSource} 拉取远程模板...`).start();
        if (type === 'git') {
            name = path.basename(templateSource);
            download(templateSource, path.join(tempPath, name), { clone }, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    spinner.color = 'red';
                    spinner.fail(chalk_1.default.red('拉取远程模板仓库失败！'));
                    yield fs.remove(tempPath);
                    return resolve();
                }
                spinner.color = 'green';
                spinner.succeed(`${chalk_1.default.grey('拉取远程模板仓库成功！')}`);
                resolve();
            }));
        }
        else if (type === 'url') {
            const zipPath = path.join(tempPath, 'temp.zip');
            request
                .get(templateSource)
                .on('close', () => {
                // unzip
                const zip = new AdmZip(zipPath);
                zip.extractAllTo(tempPath, true);
                const files = util_1.readDirWithFileTypes(tempPath)
                    .filter(file => !file.name.startsWith('.') && file.isDirectory && file.name !== '__MACOSX');
                if (files.length !== 1) {
                    spinner.color = 'red';
                    spinner.fail(chalk_1.default.red(`拉取远程模板仓库失败！\n${new Error('远程模板源组织格式错误')}`));
                    return resolve();
                }
                name = files[0].name;
                spinner.color = 'green';
                spinner.succeed(`${chalk_1.default.grey('拉取远程模板仓库成功！')}`);
                resolve();
            })
                .on('error', (err) => __awaiter(this, void 0, void 0, function* () {
                spinner.color = 'red';
                spinner.fail(chalk_1.default.red(`拉取远程模板仓库失败！\n${err}`));
                yield fs.remove(tempPath);
                return resolve();
            }))
                .pipe(fs.createWriteStream(zipPath));
        }
    }))
        .then(() => __awaiter(this, void 0, void 0, function* () {
        const templateFloder = name ? path.join(tempPath, name) : '';
        // 下载失败，只显示默认模板
        if (!fs.existsSync(templateFloder))
            return Promise.resolve([]);
        const isTemplateGroup = !fs.existsSync(path.join(templateFloder, 'package.json'));
        if (isTemplateGroup) {
            // 模板组
            const files = util_1.readDirWithFileTypes(templateFloder)
                .filter(file => !file.name.startsWith('.') && file.isDirectory && file.name !== '__MACOSX')
                .map(file => file.name);
            yield Promise.all(files.map(file => {
                const src = path.join(templateFloder, file);
                const dest = path.join(templateRootPath, file);
                return fs.move(src, dest, { overwrite: true });
            }));
            yield fs.remove(tempPath);
            return Promise.resolve(files);
        }
        else {
            // 单模板
            yield fs.move(templateFloder, path.join(templateRootPath, name), { overwrite: true });
            yield fs.remove(tempPath);
            return Promise.resolve([name]);
        }
    }));
}
exports.default = fetchTemplate;
