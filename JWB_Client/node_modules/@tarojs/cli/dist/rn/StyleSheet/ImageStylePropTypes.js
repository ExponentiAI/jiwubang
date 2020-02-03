/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const ColorPropType_1 = require("./ColorPropType");
const ImageResizeMode_1 = require("./ImageResizeMode");
const LayoutPropTypes_1 = require("./LayoutPropTypes");
const ReactPropTypes = require("prop-types");
const ShadowPropTypesIOS_1 = require("./ShadowPropTypesIOS");
const TransformPropTypes_1 = require("./TransformPropTypes");
const ImageStylePropTypes = Object.assign({}, LayoutPropTypes_1.default, ShadowPropTypesIOS_1.default, TransformPropTypes_1.default, { resizeMode: ReactPropTypes.oneOf(Object.keys(ImageResizeMode_1.default)), backfaceVisibility: ReactPropTypes.oneOf(['visible', 'hidden']), backgroundColor: ColorPropType_1.default, borderColor: ColorPropType_1.default, borderWidth: ReactPropTypes.number, borderRadius: ReactPropTypes.number, overflow: ReactPropTypes.oneOf(['visible', 'hidden']), 
    /**
     * Changes the color of all the non-transparent pixels to the tintColor.
     */
    tintColor: ColorPropType_1.default, opacity: ReactPropTypes.number, 
    /**
     * When the image has rounded corners, specifying an overlayColor will
     * cause the remaining space in the corners to be filled with a solid color.
     * This is useful in cases which are not supported by the Android
     * implementation of rounded corners:
     *   - Certain resize modes, such as 'contain'
     *   - Animated GIFs
     *
     * A typical way to use this prop is with images displayed on a solid
     * background and setting the `overlayColor` to the same color
     * as the background.
     *
     * For details of how this works under the hood, see
     * http://frescolib.org/docs/rounded-corners-and-circles.html
     *
     * @platform android
     */
    overlayColor: ReactPropTypes.string, 
    // Android-Specific styles
    borderTopLeftRadius: ReactPropTypes.number, borderTopRightRadius: ReactPropTypes.number, borderBottomLeftRadius: ReactPropTypes.number, borderBottomRightRadius: ReactPropTypes.number });
exports.default = ImageStylePropTypes;
