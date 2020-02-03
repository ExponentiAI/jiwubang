"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment = (msg, url) => 'Taro comment: ' + msg + '.' + (url ? '[兼容写法参考](' + url + ')' : '');
// 注释子组件
exports.addComment = (childNode, url) => `<!--${comment('unsupported subcomponent', url)}${childNode}-->`;
exports.uniqTypeof = (name) => {
    const typeMap = {
        '[object Boolean]': 'boolean',
        '[object String]': 'string',
        '[object Number]': 'number',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Null]': 'null',
        '[object Undefined]': 'undefined',
        '[object Symbol]': 'symbol',
        '[object Object]': 'object',
    };
    return typeMap[Object.prototype.toString.call(name)];
};
