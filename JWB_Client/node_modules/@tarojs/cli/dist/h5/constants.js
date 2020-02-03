"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nervJsImportDefaultName = 'Nerv';
exports.tabBarComponentName = 'Tabbar';
exports.tabBarContainerComponentName = 'TabbarContainer';
exports.tabBarPanelComponentName = 'TabbarPanel';
exports.providerComponentName = 'Provider';
exports.setStoreFuncName = 'setStore';
exports.tabBarConfigName = '__tabs';
exports.deviceRatioConfigName = 'deviceRatio';
exports.MAP_FROM_COMPONENTNAME_TO_ID = new Map([
    ['Video', 'id'],
    ['Canvas', 'canvasId']
]);
exports.APIS_NEED_TO_APPEND_THIS = new Map([
    ['createVideoContext', 1],
    ['createCanvasContext', 1],
    ['canvasGetImageData', 1],
    ['canvasPutImageData', 1],
    ['canvasToTempFilePath', 1]
]);
exports.FILE_TYPE = {
    ENTRY: 'ENTRY',
    PAGE: 'PAGE',
    COMPONENT: 'COMPONENT',
    NORMAL: 'NORMAL'
};
