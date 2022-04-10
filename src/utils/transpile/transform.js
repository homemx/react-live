import { transform as _transform } from "sucrase";

export default (code, { typescript } = { typescript: false }) =>
  _transform(code, {
    transforms: ["jsx", "imports"].concat(typescript ? ["typescript"] : []),
  }).code;
