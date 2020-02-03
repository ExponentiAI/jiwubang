"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertor_1 = require("./convertor");
exports.Convertor = convertor_1.default;
const build_1 = require("./build");
exports.build = build_1.default;
const doctor_1 = require("./doctor");
exports.doctor = doctor_1.default;
const project_1 = require("./create/project");
exports.Project = project_1.default;
const index_1 = require("./h5/index");
exports.H5Compiler = index_1.Compiler;
exports.default = {
    Convertor: convertor_1.default,
    build: build_1.default,
    doctor: doctor_1.default,
    Project: project_1.default,
    H5Compiler: index_1.Compiler
};
