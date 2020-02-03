"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

var flexboxProps = exports.flexboxProps = ["alignContent", "alignItems", "alignSelf", "flex", "flexBasis", "flexDirection", "flexGrow", "flexWrap", "flexShrink", "justifyContent"];

var borderProps = exports.borderProps = ["borderWidth", "borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderRadius", "borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius", "borderColor", "borderLeftColor", "borderRightColor", "borderTopColor", "borderBottomColor", "borderStyle"];

var positioningProps = exports.positioningProps = ["position", "bottom", "left", "right", "top", "zIndex"];

var boxModelProps = exports.boxModelProps = ["display", "height", "minHeight", "maxHeight", "width", "minWidth", "maxWidth", "overflow"];

var marginProps = exports.marginProps = ["margin", "marginBottom", "marginLeft", "marginRight", "marginTop"];

var paddingProps = exports.paddingProps = ["padding", "paddingBottom", "paddingLeft", "paddingRight", "paddingTop"];

var transformProps = exports.transformProps = ["transform", "backfaceVisibility"];

var backgroundProps = exports.backgroundProps = ["background", "backgroundColor"];

var colorProps = exports.colorProps = ["color", "opacity"];

var fontProps = exports.fontProps = ["fontFamily", "fontSize", "fontStyle", "fontWeight", "fontVariant", "lineHeight", "textAlign", "textDecorationLine", "textDecorationColor", "textDecorationStyle", "textTransform", "letterSpacing"];

var writingModeProps = exports.writingModeProps = ["direction"];

var reactNativeProps = exports.reactNativeProps = ["end", "start", "elevation", "borderEndWidth", "borderStartWidth", "borderStartColor", "borderEndColor", "borderBottomEndRadius", "borderBottomStartRadius", "borderTopEndRadius", "borderTopStartRadius", "textAlignVertical", "textShadowColor", "textShadowOffset", "textShadowRadius", "shadowColor", "shadowOffset", "shadowOpacity", "shadowRadius", "marginHorizontal", "marginVertical", "marginEnd", "marginStart", "paddingHorizontal", "paddingVertical", "paddingEnd", "paddingStart", "decomposedMatrix", "transformMatrix", "resizeMode", "tintColor", "overlayColor", "writingDirection", "includeFontPadding", "aspectRatio"];

var CSS2RNProps = exports.CSS2RNProps = ["border", "boxShadow", "flexFlow", "font", "textDecoration", "textShadow"];

var allProps = exports.allProps = flatten([flexboxProps, borderProps, positioningProps, boxModelProps, marginProps, paddingProps, transformProps, backgroundProps, colorProps, fontProps, writingModeProps, reactNativeProps]);

var allCSS2RNProps = exports.allCSS2RNProps = flatten([allProps, CSS2RNProps]);