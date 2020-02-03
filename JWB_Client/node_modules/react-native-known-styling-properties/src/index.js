function flatten(arr) {
  return arr.reduce(function(flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, []);
}

export const flexboxProps = [
  "alignContent",
  "alignItems",
  "alignSelf",
  "flex",
  "flexBasis",
  "flexDirection",
  "flexGrow",
  "flexWrap",
  "flexShrink",
  "justifyContent"
];

export const borderProps = [
  "borderWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderRightWidth",
  "borderTopWidth",
  "borderRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderColor",
  "borderLeftColor",
  "borderRightColor",
  "borderTopColor",
  "borderBottomColor",
  "borderStyle"
];

export const positioningProps = [
  "position",
  "bottom",
  "left",
  "right",
  "top",
  "zIndex"
];

export const boxModelProps = [
  "display",
  "height",
  "minHeight",
  "maxHeight",
  "width",
  "minWidth",
  "maxWidth",
  "overflow"
];

export const marginProps = [
  "margin",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginTop"
];

export const paddingProps = [
  "padding",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop"
];

export const transformProps = ["transform", "backfaceVisibility"];

export const backgroundProps = ["background", "backgroundColor"];

export const colorProps = ["color", "opacity"];

export const fontProps = [
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "fontVariant",
  "lineHeight",
  "textAlign",
  "textDecorationLine",
  "textDecorationColor",
  "textDecorationStyle",
  "textTransform",
  "letterSpacing"
];

export const writingModeProps = ["direction"];

export const reactNativeProps = [
  "end",
  "start",
  "elevation",
  "borderEndWidth",
  "borderStartWidth",
  "borderStartColor",
  "borderEndColor",
  "borderBottomEndRadius",
  "borderBottomStartRadius",
  "borderTopEndRadius",
  "borderTopStartRadius",
  "textAlignVertical",
  "textShadowColor",
  "textShadowOffset",
  "textShadowRadius",
  "shadowColor",
  "shadowOffset",
  "shadowOpacity",
  "shadowRadius",
  "marginHorizontal",
  "marginVertical",
  "marginEnd",
  "marginStart",
  "paddingHorizontal",
  "paddingVertical",
  "paddingEnd",
  "paddingStart",
  "decomposedMatrix",
  "transformMatrix",
  "resizeMode",
  "tintColor",
  "overlayColor",
  "writingDirection",
  "includeFontPadding",
  "aspectRatio"
];

export const CSS2RNProps = [
  "border",
  "boxShadow",
  "flexFlow",
  "font",
  "textDecoration",
  "textShadow"
];

export const allProps = flatten([
  flexboxProps,
  borderProps,
  positioningProps,
  boxModelProps,
  marginProps,
  paddingProps,
  transformProps,
  backgroundProps,
  colorProps,
  fontProps,
  writingModeProps,
  reactNativeProps
]);

export const allCSS2RNProps = flatten([allProps, CSS2RNProps]);
