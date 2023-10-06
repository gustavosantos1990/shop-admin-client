import * as Yup from "yup";

const allowedTypes = ["PRODUCT_COMPONENT", "GIFT"];
const allowedMeasures = ["UNITY", "MT", "CM", "MT2", "CM2"];

export default Yup.object().shape({
    name: Yup.string()
        .default("")
        .min(2, "Tamanho inválido.")
        .required('Nome é obrigatório.'),
    type: Yup.string().default("").oneOf(allowedTypes).required(),
    measure: Yup.string().default("").oneOf(allowedMeasures).required(),
});