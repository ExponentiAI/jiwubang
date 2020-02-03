/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const ColorPropType_1 = require("./ColorPropType");
const LayoutPropTypes_1 = require("./LayoutPropTypes");
const ReactPropTypes = require("prop-types");
const ShadowPropTypesIOS_1 = require("./ShadowPropTypesIOS");
const TransformPropTypes_1 = require("./TransformPropTypes");
/**
 * Warning: Some of these properties may not be supported in all releases.
 */
const ViewStylePropTypes = Object.assign({}, LayoutPropTypes_1.default, ShadowPropTypesIOS_1.default, TransformPropTypes_1.default, { backfaceVisibility: ReactPropTypes.oneOf(['visible', 'hidden']), backgroundColor: ColorPropType_1.default, borderColor: ColorPropType_1.default, borderTopColor: ColorPropType_1.default, borderRightColor: ColorPropType_1.default, borderBottomColor: ColorPropType_1.default, borderLeftColor: ColorPropType_1.default, borderStartColor: ColorPropType_1.default, borderEndColor: ColorPropType_1.default, borderRadius: ReactPropTypes.number, borderTopLeftRadius: ReactPropTypes.number, borderTopRightRadius: ReactPropTypes.number, borderTopStartRadius: ReactPropTypes.number, borderTopEndRadius: ReactPropTypes.number, borderBottomLeftRadius: ReactPropTypes.number, borderBottomRightRadius: ReactPropTypes.number, borderBottomStartRadius: ReactPropTypes.number, borderBottomEndRadius: ReactPropTypes.number, borderStyle: ReactPropTypes.oneOf(['solid', 'dotted', 'dashed']), borderWidth: ReactPropTypes.number, borderTopWidth: ReactPropTypes.number, borderRightWidth: ReactPropTypes.number, borderBottomWidth: ReactPropTypes.number, borderLeftWidth: ReactPropTypes.number, opacity: ReactPropTypes.number, 
    /**
     * (Android-only) Sets the elevation of a view, using Android's underlying
     * [elevation API](https://developer.android.com/training/material/shadows-clipping.html#Elevation).
     * This adds a drop shadow to the item and affects z-order for overlapping views.
     * Only supported on Android 5.0+, has no effect on earlier versions.
     * @platform android
     */
    elevation: ReactPropTypes.number });
exports.default = ViewStylePropTypes;
