"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Adapters;
(function (Adapters) {
    Adapters["weapp"] = "weapp";
    Adapters["swan"] = "swan";
    Adapters["alipay"] = "alipay";
    Adapters["quickapp"] = "quickapp";
    Adapters["tt"] = "tt";
    Adapters["qq"] = "qq";
    Adapters["jd"] = "jd";
})(Adapters = exports.Adapters || (exports.Adapters = {}));
const weixinAdapter = {
    if: 'wx:if',
    else: 'wx:else',
    elseif: 'wx:elif',
    for: 'wx:for',
    forItem: 'wx:for-item',
    forIndex: 'wx:for-index',
    key: 'wx:key',
    type: "weapp" /* weapp */
};
const swanAdapter = {
    if: 's-if',
    else: 's-else',
    elseif: 's-elif',
    for: 's-for',
    forItem: 's-for-item',
    forIndex: 's-for-index',
    key: 's-key',
    type: "swan" /* swan */
};
const alipayAdapter = {
    if: 'a:if',
    else: 'a:else',
    elseif: 'a:elif',
    for: 'a:for',
    forItem: 'a:for-item',
    forIndex: 'a:for-index',
    key: 'a:key',
    type: "alipay" /* alipay */
};
const ttAdapter = {
    if: 'tt:if',
    else: 'tt:else',
    elseif: 'tt:elif',
    for: 'tt:for',
    forItem: 'tt:for-item',
    forIndex: 'tt:for-index',
    key: 'tt:key',
    type: "tt" /* tt */
};
const quickappAdapter = {
    if: 'if',
    else: 'else',
    elseif: 'elif',
    for: 'for',
    forItem: 'for-item',
    forIndex: 'for-index',
    key: 'key',
    type: "quickapp" /* quickapp */
};
const qqAdapter = {
    if: 'qq:if',
    else: 'qq:else',
    elseif: 'qq:elif',
    for: 'qq:for',
    forItem: 'qq:for-item',
    forIndex: 'qq:for-index',
    key: 'qq:key',
    type: "qq" /* qq */
};
const jdAdapter = {
    if: 'jd:if',
    else: 'jd:else',
    elseif: 'jd:elif',
    for: 'jd:for',
    forItem: 'jd:for-item',
    forIndex: 'jd:for-index',
    key: 'jd:key',
    type: "jd" /* jd */
};
exports.Adapter = weixinAdapter;
exports.isNewPropsSystem = () => {
    return ["weapp" /* weapp */, "swan" /* swan */, "tt" /* tt */, "qq" /* qq */, "alipay" /* alipay */, "quickapp" /* quickapp */, "jd" /* jd */].includes(exports.Adapter.type);
};
function setAdapter(adapter) {
    switch (adapter.toLowerCase()) {
        case "swan" /* swan */:
            exports.Adapter = swanAdapter;
            break;
        case "alipay" /* alipay */:
            exports.Adapter = alipayAdapter;
            break;
        case "tt" /* tt */:
            exports.Adapter = ttAdapter;
            break;
        case "quickapp" /* quickapp */:
            exports.Adapter = quickappAdapter;
            break;
        case "qq" /* qq */:
            exports.Adapter = qqAdapter;
            break;
        case "jd" /* jd */:
            exports.Adapter = jdAdapter;
            break;
        default:
            exports.Adapter = weixinAdapter;
            break;
    }
}
exports.setAdapter = setAdapter;
//# sourceMappingURL=adapter.js.map