"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nameList = ['translate', 'translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'rotate', 'rotateX', 'rotateY'];
exports.default = {
    'transform': (value, declaration, addDeclaration) => {
        const name = value.match(/\w+/)[0];
        if (!~nameList.indexOf(name)) {
            return 'I:';
        }
        if (~value.indexOf('%')) {
            return 'I:';
        }
    }
};
