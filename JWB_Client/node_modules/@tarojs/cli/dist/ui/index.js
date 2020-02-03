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
const chokidar = require("chokidar");
const chalk_1 = require("chalk");
const _ = require("lodash");
const h5_1 = require("../h5");
const h5_2 = require("./h5");
const rn_1 = require("./rn");
const weapp_1 = require("./weapp");
const quickapp_1 = require("./quickapp");
const config_1 = require("../config");
const util_1 = require("../util");
const constants_1 = require("../util/constants");
const helper_1 = require("../mini/helper");
const common_1 = require("./common");
const rn_2 = require("../rn");
let buildData;
let platforms;
function setBuildData(appPath, uiIndex) {
    const configDir = path.join(appPath, constants_1.PROJECT_CONFIG);
    const projectConfig = require(configDir)(_.merge);
    const sourceDirName = projectConfig.sourceRoot || config_1.default.SOURCE_DIR;
    const outputDirName = projectConfig.outputRoot || config_1.default.OUTPUT_DIR;
    const sourceDir = path.join(appPath, sourceDirName);
    let entryFilePath;
    if (uiIndex) {
        entryFilePath = util_1.resolveScriptPath(path.join(sourceDir, uiIndex));
    }
    else {
        entryFilePath = util_1.resolveScriptPath(path.join(sourceDir, 'index'));
    }
    const entryFileName = path.basename(entryFilePath);
    const tempPath = path.join(appPath, common_1.TEMP_DIR);
    const rnTempPath = path.join(appPath, common_1.RN_TEMP_DIR);
    buildData = {
        appPath,
        projectConfig,
        sourceDirName,
        outputDirName,
        sourceDir,
        entryFilePath,
        entryFileName,
        tempPath,
        rnTempPath
    };
}
function buildEntry(uiIndex) {
    const { appPath, outputDirName } = buildData;
    let indexName = 'index';
    if (uiIndex) {
        indexName = path.basename(uiIndex, path.extname(uiIndex));
    }
    let content = '';
    platforms.forEach((item, index) => {
        let dir = item;
        if ([
            "weapp" /* WEAPP */,
            "alipay" /* ALIPAY */,
            "qq" /* QQ */,
            "tt" /* TT */,
            "swan" /* SWAN */,
            "jd" /* JD */
        ].includes(item)) {
            dir = common_1.WEAPP_OUTPUT_NAME;
        }
        content += `if (process.env.TARO_ENV === '${item}') {
      module.exports = require('./${dir}/${indexName}')
      module.exports.default = module.exports
    }`;
        if (index < platforms.length - 1) {
            content += ' else ';
        }
        else {
            content += ` else {
        module.exports = require('./${common_1.WEAPP_OUTPUT_NAME}/${indexName}')
        module.exports.default = module.exports
      }`;
        }
    });
    const outputDir = path.join(appPath, outputDirName);
    fs.writeFileSync(path.join(outputDir, `index.js`), content);
}
function watchFiles() {
    const { sourceDir, projectConfig, appPath, outputDirName, tempPath } = buildData;
    const platforms = _.get(buildData, 'projectConfig.ui.platforms');
    console.log('\n', chalk_1.default.gray('监听文件修改中...'), '\n');
    const watchList = [sourceDir];
    const uiConfig = projectConfig.ui;
    let extraWatchFiles;
    if (uiConfig && Array.isArray(uiConfig.extraWatchFiles)) {
        extraWatchFiles = uiConfig.extraWatchFiles;
        extraWatchFiles.forEach(item => {
            watchList.push(path.join(appPath, item.path));
            if (typeof item.handler === 'function')
                item.callback = item.handler({ buildH5Script: h5_2.buildH5Script });
        });
    }
    const watcher = chokidar.watch(watchList, {
        ignored: /(^|[/\\])\../,
        ignoreInitial: true
    });
    function syncWeappFile(filePath) {
        const outputDir = path.join(appPath, outputDirName, common_1.WEAPP_OUTPUT_NAME);
        common_1.copyFileToDist(filePath, sourceDir, outputDir, buildData);
        // 依赖分析
        const extname = path.extname(filePath);
        if (constants_1.REG_STYLE.test(extname)) {
            common_1.analyzeStyleFilesImport([filePath], sourceDir, outputDir, buildData);
        }
        else {
            common_1.analyzeFiles([filePath], sourceDir, outputDir, buildData);
        }
    }
    function syncQuickappFile(filePath) {
        const outputDir = path.join(appPath, outputDirName, common_1.QUICKAPP_OUTPUT_NAME);
        common_1.copyFileToDist(filePath, sourceDir, outputDir, buildData);
        // 依赖分析
        const extname = path.extname(filePath);
        if (constants_1.REG_STYLE.test(extname)) {
            common_1.analyzeStyleFilesImport([filePath], sourceDir, outputDir, buildData);
        }
        else {
            common_1.analyzeFiles([filePath], sourceDir, outputDir, buildData);
        }
    }
    function syncH5File(filePath, compiler) {
        const { sourceDir, appPath, outputDirName, tempPath } = buildData;
        const outputDir = path.join(appPath, outputDirName, common_1.H5_OUTPUT_NAME);
        let fileTempPath = filePath.replace(sourceDir, tempPath);
        fileTempPath = fileTempPath.replace(new RegExp(`${path.extname(fileTempPath)}$`), '');
        fileTempPath = util_1.resolveScriptPath(fileTempPath);
        compiler.processFiles(filePath);
        if (process.env.TARO_BUILD_TYPE === 'script') {
            h5_2.buildH5Script(buildData);
        }
        else {
            common_1.copyFileToDist(fileTempPath, tempPath, outputDir, buildData);
            // 依赖分析
            const extname = path.extname(filePath);
            if (constants_1.REG_STYLE.test(extname)) {
                common_1.analyzeStyleFilesImport([fileTempPath], tempPath, outputDir, buildData);
            }
            else {
                common_1.analyzeFiles([fileTempPath], tempPath, outputDir, buildData);
            }
        }
    }
    function syncRNFile(filePath, compiler) {
        const { sourceDir, appPath, outputDirName, rnTempPath } = buildData;
        const outputDir = path.join(appPath, outputDirName, common_1.RN_OUTPUT_NAME);
        const fileTempPath = filePath.replace(sourceDir, rnTempPath);
        compiler.processFiles(filePath);
        common_1.copyFileToDist(fileTempPath, tempPath, outputDir, buildData);
        // 依赖分析
        const extname = path.extname(filePath);
        if (constants_1.REG_STYLE.test(extname)) {
            common_1.analyzeStyleFilesImport([fileTempPath], tempPath, outputDir, buildData);
        }
        else {
            common_1.analyzeFiles([fileTempPath], tempPath, outputDir, buildData);
        }
    }
    function handleChange(filePath, type, tips) {
        const relativePath = path.relative(appPath, filePath);
        const compiler = new h5_1.Compiler(appPath);
        const rnCompiler = new rn_2.Compiler(appPath);
        util_1.printLog(type, tips, relativePath);
        let processed = false;
        extraWatchFiles && extraWatchFiles.forEach(item => {
            if (filePath.indexOf(item.path.substr(2)) < 0)
                return;
            if (typeof item.callback === 'function') {
                item.callback();
                processed = true;
            }
        });
        if (processed)
            return;
        try {
            if (platforms && Array.isArray(platforms)) {
                platforms.includes("weapp" /* WEAPP */) && syncWeappFile(filePath);
                platforms.includes("quickapp" /* QUICKAPP */) && syncQuickappFile(filePath);
                platforms.includes("h5" /* H5 */) && syncH5File(filePath, compiler);
                platforms.includes("rn" /* RN */) && syncRNFile(filePath, rnCompiler);
            }
            else {
                syncWeappFile(filePath);
                syncH5File(filePath, compiler);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    watcher
        .on('add', filePath => handleChange(filePath, "create" /* CREATE */, '添加文件'))
        .on('change', filePath => handleChange(filePath, "modify" /* MODIFY */, '文件变动'))
        .on('unlink', filePath => {
        for (const path in extraWatchFiles) {
            if (filePath.indexOf(path.substr(2)) > -1)
                return;
        }
        const relativePath = path.relative(appPath, filePath);
        util_1.printLog("unlink" /* UNLINK */, '删除文件', relativePath);
        const weappOutputPath = path.join(appPath, outputDirName, common_1.WEAPP_OUTPUT_NAME);
        const quickappOutputPath = path.join(appPath, outputDirName, common_1.QUICKAPP_OUTPUT_NAME);
        const h5OutputPath = path.join(appPath, outputDirName, common_1.H5_OUTPUT_NAME);
        const fileTempPath = filePath.replace(sourceDir, tempPath);
        const fileWeappPath = filePath.replace(sourceDir, weappOutputPath);
        const fileQuickappPath = filePath.replace(sourceDir, quickappOutputPath);
        const fileH5Path = filePath.replace(sourceDir, h5OutputPath);
        fs.existsSync(fileTempPath) && fs.unlinkSync(fileTempPath);
        fs.existsSync(fileWeappPath) && fs.unlinkSync(fileWeappPath);
        fs.existsSync(fileQuickappPath) && fs.unlinkSync(fileQuickappPath);
        fs.existsSync(fileH5Path) && fs.unlinkSync(fileH5Path);
    });
}
function build(appPath, { watch, uiIndex }) {
    return __awaiter(this, void 0, void 0, function* () {
        setBuildData(appPath, uiIndex);
        helper_1.setBuildData(appPath, "weapp" /* WEAPP */);
        helper_1.setBuildData(appPath, "quickapp" /* QUICKAPP */);
        platforms = _.get(buildData, 'projectConfig.ui.platforms') || ["weapp" /* WEAPP */, "h5" /* H5 */];
        buildEntry(uiIndex);
        if (platforms && Array.isArray(platforms)) {
            platforms.includes("weapp" /* WEAPP */) && (yield weapp_1.buildForWeapp(buildData));
            platforms.includes("quickapp" /* QUICKAPP */) && (yield quickapp_1.buildForQuickapp(buildData));
            platforms.includes("h5" /* H5 */) && (yield h5_2.buildForH5(uiIndex, buildData));
            platforms.includes("rn" /* RN */) && (yield rn_1.buildForRN(uiIndex, buildData));
        }
        else {
            yield weapp_1.buildForWeapp(buildData);
            yield h5_2.buildForH5(uiIndex, buildData);
        }
        if (watch) {
            watchFiles();
        }
    });
}
exports.build = build;
