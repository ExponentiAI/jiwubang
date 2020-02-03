"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isExportBlock = isExportBlock;
/**
 * Check whether a node is an :export block
 */
function isExportBlock(node /*: Object */) /*: boolean */{
  if (node.type === "rule" && node.selector && node.selector === ":export") {
    return true;
  }

  return false;
}