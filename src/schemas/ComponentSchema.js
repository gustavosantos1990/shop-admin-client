import * as Yup from "yup";

const allowedMeasures = ["UNITY", "CM", "CM2"];

//export const componentMultiDimensionSchema = Yup.object().shape({
export default Yup.object().shape({
    id: Yup.string(),
    name: Yup.string()
        .default("")
        .min(2, "Tamanho inválido.")
        .required('Nome é obrigatório.'),
    measure: Yup.object().shape({
<<<<<<< HEAD
        value: Yup.string()
            .default("")
            .oneOf(allowedMeasures)
            .required("Obrigatório informar a medida"),
        multi_dimension: Yup.bool().required("Obrigatório informar se medida é multi dimensional")
=======
        name: Yup.string().default(""),
        code: Yup.string().default("")
            .oneOf(allowedMeasures)
            .required("Obrigatório informar a medida"),
        symbol: Yup.string().default(""),
        multi_dimension: Yup.bool().default(false).required("Obrigatório informar se medida é multi dimensional")
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d
    }).required("Obrigatório informar a medida"),
    base_buy_paid_value: Yup.number()
        .default(0.00)
        .required("Obrigatório informar o valor pago!"),
    base_buy_amount: Yup.number()
        .default(0.00)
        .test(
            "validate_base_buy_amount",
            "Obrigatório informar a quantidade comprada!",
<<<<<<< HEAD
            (value, context) => !context.parent.measure.multi_dimension && value >= 0),
    base_buy_height: Yup.number()
        .default(0.00)
        .test(
            "validate_base_buy_height",
            "Obrigatório informar a altura!",
            (value, context) => context.parent.measure.multi_dimension && value >= 0),
    base_buy_width: Yup.number()
        .default(0.00)
        .test(
            "validate_base_buy_width",
            "Obrigatório informar a largura!",
            (value, context) => context.parent.measure.multi_dimension && value >= 0)
=======
            (value, context) => context.parent.measure.multi_dimension || value > 0),
    base_buy_height: Yup.number()
        .default(0.00)
        .nonNullable("Obrigatório informar a altura!")
        .test(
            "validate_base_buy_height",
            "Obrigatório informar a altura!",
            (value, context) => !context.parent.measure.multi_dimension || value > 0),
    base_buy_width: Yup.number()
        .default(0.00)
        .nonNullable("Obrigatório informar a largura!")
        .test(
            "validate_base_buy_width",
            "Obrigatório informar a largura!",
            (value, context) => !context.parent.measure.multi_dimension || value > 0)
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d
});