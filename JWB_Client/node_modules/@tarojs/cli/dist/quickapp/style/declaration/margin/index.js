"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    'margin': (value, declaration, addDeclaration) => {
        if (~value.indexOf('auto')) {
            return 'I:';
        }
    },
    'margin-bottom': '',
    'margin-left': '',
    'margin-right': '',
    'margin-top': ''
};
