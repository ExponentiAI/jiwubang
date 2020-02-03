import { allProps, allCSS2RNProps } from "./index";

const uniq = function(arrArg) {
  return arrArg.filter(function(elem, pos, arr) {
    return arr.indexOf(elem) == pos;
  });
};

it("should have a flat array of all known React Native props", () => {
  expect(allProps).toMatchSnapshot();
});

it("should not have duplicate props in all known React Native props", () => {
  expect(allProps).toEqual(uniq(allProps));
});

it("should have a flat array of all known css-to-react-native props", () => {
  expect(allCSS2RNProps).toMatchSnapshot();
});

it("should not have duplicate props in all known css-to-react-native props", () => {
  expect(allCSS2RNProps).toEqual(uniq(allCSS2RNProps));
});
