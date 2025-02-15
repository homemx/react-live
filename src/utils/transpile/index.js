import React from "react";
import transform from "./transform";
import errorBoundary from "./errorBoundary";
import evalCode from "./evalCode";

export const generateElement = ({ code = "", scope = {}, typescript = false }, errorCallback) => {
  // NOTE: Remove trailing semicolon to get an actual expression.
  const codeTrimmed = code.trim().replace(/;$/, "");

  // NOTE: Workaround for classes and arrow functions.
  const transformed = transform(`return (${codeTrimmed})`, {
    typescript,
  }).trim();
  return errorBoundary(
    evalCode(transformed, { React, ...scope }),
    errorCallback
  );
};

export const renderElementAsync = (
  { code = "", scope = {}, typescript = false },
  resultCallback,
  errorCallback
  // eslint-disable-next-line consistent-return
) => {
  // eslint-disable-next-line no-debugger
  debugger;
  const render = (element) => {
    if (typeof element === "undefined") {
      errorCallback(new SyntaxError("`render` must be called with valid JSX."));
    } else {
      resultCallback(errorBoundary(element, errorCallback));
    }
  };

  if (!/render\s*\(/.test(code)) {
    return errorCallback(
      new SyntaxError("No-Inline evaluations must call `render`.")
    );
  }

  evalCode(transform(code, { typescript }), { React, ...scope, render });
};
