"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THIRD_PARTY_COMPONENTS = new Set();
// tslint:disable-next-line:variable-name
exports.DEFAULT_Component_SET = new Set([
    'View',
    'ScrollView',
    'Swiper',
    'CoverView',
    'CoverImage',
    'Icon',
    'Text',
    'RichText',
    'Progress',
    'Button',
    'Checkbox',
    'Form',
    'Input',
    'Label',
    'Picker',
    'PickerView',
    'PickerViewColumn',
    'Radio',
    'RadioGroup',
    'CheckboxGroup',
    'Slider',
    'Switch',
    'Textarea',
    'Navigator',
    'Audio',
    'Image',
    'Video',
    'Camera',
    'LivePlayer',
    'LivePusher',
    'Map',
    'Canvas',
    'OpenData',
    'WebView',
    'SwiperItem',
    'MovableArea',
    'MovableView',
    'FunctionalPageNavigator',
    'Ad',
    'Block',
    'Import',
    'OfficialAccount',
    'Template',
    'Editor'
]);
// tslint:disable-next-line:variable-name
exports.DEFAULT_Component_SET_COPY = new Set([]);
exports.DEFAULT_Component_SET.forEach((c) => exports.DEFAULT_Component_SET_COPY.add(c));
exports.INTERNAL_SAFE_GET = 'internal_safe_get';
exports.TARO_PACKAGE_NAME = '@tarojs/taro';
exports.COMPONENTS_PACKAGE_NAME = '@tarojs/components';
exports.REDUX_PACKAGE_NAME = '@tarojs/redux';
exports.MOBX_PACKAGE_NAME = '@tarojs/mobx';
exports.MAP_CALL_ITERATOR = '__item';
exports.INTERNAL_INLINE_STYLE = 'internal_inline_style';
exports.INTERNAL_GET_ORIGNAL = 'internal_get_original';
exports.HANDLE_LOOP_REF = 'handleLoopRef';
exports.PROPS_MANAGER = 'propsManager';
exports.GEN_COMP_ID = 'genCompid';
exports.GEN_LOOP_COMPID = 'genLoopCompid';
exports.CLASS_COMPONENT_UID = '_$uid';
exports.LOOP_STATE = '$loopState';
exports.setLoopState = (s) => exports.LOOP_STATE = s;
exports.PREV_COMPID = '$prevCompid';
exports.COMPID = '$compid';
exports.setCompId = (s) => exports.COMPID = s;
exports.LOOP_ORIGINAL = '$original';
exports.setLoopOriginal = (s) => exports.LOOP_ORIGINAL = s;
exports.LOOP_CALLEE = '$anonymousCallee_';
exports.setLoopCallee = (s) => exports.LOOP_CALLEE = s;
exports.CONTEXT_PROVIDER = 'PrivateContextProvider';
exports.SPECIAL_COMPONENT_PROPS = new Map();
exports.IS_TARO_READY = '$taroCompReady';
exports.setIsTaroReady = (s) => exports.IS_TARO_READY = s;
exports.SPECIAL_COMPONENT_PROPS.set('Progress', new Set([
    'activeColor',
    'backgroundColor'
]));
exports.IMAGE_COMPONENTS = new Set([
    'Image',
    'CoverImage'
]);
exports.swanSpecialAttrs = {
    'ScrollView': ['scrollTop', 'scrollLeft', 'scrollIntoView'],
    'Input': ['value'],
    'Textarea': ['value'],
    'MovableView': ['x', 'y'],
    'Slider': ['value']
};
exports.ALIPAY_BUBBLE_EVENTS = new Set([
    'onTouchStart',
    'onTouchMove',
    'onTouchEnd',
    'onTouchCancel',
    'onClick',
    'onLongTap'
]);
exports.ANONYMOUS_FUNC = 'anonymousFunc';
exports.TRANSFORM_COMPONENT_PROPS = new Map();
exports.TRANSFORM_COMPONENT_PROPS.set("alipay" /* alipay */, {
    'Canvas': {
        'canvasId': 'id'
    }
});
exports.lessThanSignPlacehold = '__LESS_THAN_SIGN_PLACEHOLDER__';
exports.FN_PREFIX = '__fn_';
exports.setFnPrefix = (s) => exports.FN_PREFIX = s;
exports.quickappComponentName = new Set([
    'Swiper',
    'Audio',
    'Image',
    'Progress',
    // 'Text',
    'Input',
    'Label',
    'Picker',
    'Slider',
    'Switch',
    'Textarea',
    'Video',
    'Camera',
    'Canvas',
    'Map',
    'Button'
]);
//# sourceMappingURL=constant.js.map