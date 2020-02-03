"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("babel-types");
const utils_1 = require("./utils");
function buildMethodName(n) {
    return `render${n.charAt(0).toUpperCase() + n.slice(1)}`;
}
exports.buildVistor = () => {
    const renameMap = new Map();
    const classMethodRenamer = () => {
        return {
            visitor: {
                JSXElement(path) {
                    let methodName = '';
                    const classMethod = path.findParent(p => p.isClassMethod());
                    if (classMethod && classMethod.isClassMethod() && t.isIdentifier(classMethod.node.key)) {
                        methodName = classMethod.node.key.name;
                        if (methodName.startsWith('render') || methodName === 'constructor') {
                            return;
                        }
                        classMethod.node.key = t.identifier(buildMethodName(methodName));
                    }
                    const classProp = path.findParent(p => p.isClassProperty());
                    if (classProp && classProp.isClassProperty()) {
                        methodName = classProp.node.key.name;
                        if (methodName.startsWith('render')) {
                            return;
                        }
                        if (!t.isArrowFunctionExpression(classProp.node.value)) {
                            return;
                        }
                        classProp.replaceWith(t.classMethod('method', t.identifier(buildMethodName(methodName)), classProp.node.value.params, t.isBlockStatement(classProp.node.value.body) ? classProp.node.value.body : t.blockStatement([
                            t.returnStatement(classProp.node.value.body)
                        ])));
                        return;
                    }
                    if (methodName.length > 0 && !methodName.startsWith('render')) {
                        renameMap.set(methodName, buildMethodName(methodName));
                    }
                },
                Identifier(path) {
                    const name = path.node.name;
                    if (renameMap.has(name)) {
                        const memberExpr = path.parentPath;
                        if (memberExpr.isMemberExpression() && memberExpr.parentPath.isCallExpression()) {
                            const object = memberExpr.get('object');
                            if (object.isThisExpression()) {
                                path.replaceWith(t.identifier(buildMethodName(name)));
                            }
                            else if (object.isIdentifier() && utils_1.isDerivedFromThis(path.scope, object.node.name)) {
                                memberExpr.replaceWith(t.memberExpression(t.thisExpression(), t.identifier(buildMethodName(name))));
                            }
                        }
                        else if (memberExpr.isCallExpression() && utils_1.isDerivedFromThis(path.scope, name)) {
                            path.scope.rename(name, buildMethodName(name));
                        }
                    }
                }
            }
        };
    };
    return classMethodRenamer;
};
//# sourceMappingURL=class-method-renamer.js.map