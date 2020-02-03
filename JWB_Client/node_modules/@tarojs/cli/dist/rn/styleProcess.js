"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const postcss = require("postcss");
const chalk_1 = require("chalk");
const pxtransform = require("postcss-pxtransform");
const taro_css_to_react_native_1 = require("taro-css-to-react-native");
const index_1 = require("./StyleSheet/index");
const Util = require("../util");
const npmProcess = require("../util/npm");
const constants_1 = require("../util/constants");
const stylelintConfig = require("../config/rn-stylelint.json");
const DEVICE_RATIO = 'deviceRatio';
function getWrapedCSS(css) {
    return (`
import { StyleSheet, Dimensions } from 'react-native'

// 一般app 只有竖屏模式，所以可以只获取一次 width
const deviceWidthDp = Dimensions.get('window').width
const uiWidthPx = 375

function scalePx2dp (uiElementPx) {
  return uiElementPx * deviceWidthDp / uiWidthPx
}

export default StyleSheet.create(${css})
`);
}
/**
 * @description 读取 css/scss/less 文件，预处理后，返回 css string
 * @param {string} filePath
 * @param {object} pluginsConfig
 * @param {string} appPath
 * @returns {*}
 */
function loadStyle({ filePath, pluginsConfig }, appPath) {
    const fileExt = path.extname(filePath);
    const pluginName = constants_1.FILE_PROCESSOR_MAP[fileExt];
    if (pluginName) {
        return npmProcess.callPlugin(pluginName, null, filePath, pluginsConfig[pluginName] || {}, appPath)
            .then((item) => {
            return {
                css: item.css.toString(),
                filePath
            };
        }).catch((e) => {
            Util.printLog("error" /* ERROR */, '样式预处理', filePath);
            console.log(e.stack);
        });
    }
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                return reject(err);
            }
            resolve({
                css: content,
                filePath
            });
        });
    });
}
exports.loadStyle = loadStyle;
/**
 * @description 传入 css string ，返回 postCSS 处理后的 css string
 * @param {string} css
 * @param {string} filePath
 * @param {object} projectConfig
 * @returns {Function | any}
 */
function postCSS({ css, filePath, projectConfig }) {
    const pxTransformConfig = {
        designWidth: projectConfig.designWidth || 750
    };
    if (projectConfig.hasOwnProperty(DEVICE_RATIO)) {
        pxTransformConfig[DEVICE_RATIO] = projectConfig.deviceRatio;
    }
    return postcss([
        require('stylelint')(stylelintConfig),
        require('postcss-reporter')({ clearReportedMessages: true }),
        pxtransform(Object.assign({ platform: 'rn' }, pxTransformConfig))
    ])
        .process(css, { from: filePath })
        .then((result) => {
        return {
            css: result.css,
            filePath
        };
    }).catch((e) => {
        Util.printLog("error" /* ERROR */, '样式转换', filePath);
        console.log(e.stack);
    });
}
exports.postCSS = postCSS;
function getStyleObject({ css, filePath }) {
    let styleObject = {};
    try {
        styleObject = taro_css_to_react_native_1.default(css);
    }
    catch (err) {
        Util.printLog("warning" /* WARNING */, 'css-to-react-native 报错', filePath);
        console.log(chalk_1.default.red(err.stack));
    }
    return styleObject;
}
exports.getStyleObject = getStyleObject;
function validateStyle({ styleObject, filePath }) {
    for (const name in styleObject) {
        try {
            index_1.StyleSheetValidation.validateStyle(name, styleObject);
        }
        catch (err) {
            // 先忽略掉 scalePx2dp 的报错
            if (/Invalid prop `.*` of type `string` supplied to `.*`, expected `number`[^]*/g.test(err.message))
                return;
            Util.printLog("warning" /* WARNING */, '样式不支持', filePath);
            console.log(chalk_1.default.red(err.message));
        }
    }
}
exports.validateStyle = validateStyle;
function writeStyleFile({ css, tempFilePath }) {
    const fileContent = getWrapedCSS(css.replace(/"(scalePx2dp\(.*?\))"/g, '$1'));
    fs.ensureDirSync(path.dirname(tempFilePath));
    fs.writeFileSync(tempFilePath, fileContent);
    Util.printLog("generate" /* GENERATE */, '生成样式文件', tempFilePath);
}
exports.writeStyleFile = writeStyleFile;
