"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const jdreact_core_lib_1 = require("@jdreact/jdreact-core-lib");
class JDReactTaroDemo extends react_1.Component {
    render() {
        return (<react_native_1.View style={styles.container}>
        <jdreact_core_lib_1.JDText>Hello, JDReactTaroDemo</jdreact_core_lib_1.JDText>
      </react_native_1.View>);
    }
}
react_native_1.AppRegistry.registerComponent('JDReactTaroDemo', () => JDReactTaroDemo);
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
var app = document.getElementById('m_common_content');
if (!app) {
    app = document.createElement('div');
    document.body.appendChild(app);
}
react_native_1.AppRegistry.runApplication('JDReactTaroDemo', {
    rootTag: app
});
