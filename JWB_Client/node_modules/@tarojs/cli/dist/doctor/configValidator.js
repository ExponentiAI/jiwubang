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
const Joi = require("joi");
const _ = require("lodash/fp");
const joi2desc_1 = require("./joi2desc");
const configSchema_1 = require("./configSchema");
function buildDesc(error) {
    return error.path.join('.') + ' ' + joi2desc_1.default(error);
}
function buildLine(error) {
    return {
        desc: buildDesc(error),
        valid: false
    };
}
function buildReport(configPath, errors) {
    const errorLines = _.compose(_.map(buildLine), _.get('details'))(errors);
    return {
        desc: `检查 Taro 配置 (${configPath})`,
        lines: errorLines
    };
}
function default_1({ configPath, projectConfig }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = Joi.validate(projectConfig, configSchema_1.default, { abortEarly: false });
        return buildReport(configPath, error);
    });
}
exports.default = default_1;
