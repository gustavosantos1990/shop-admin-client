import * as Yup from "yup";

export default Yup.object().shape({
    product: Yup.object().shape({
        id: Yup.string()
            .default("")
            .required("Obrigatório selecionar produto"),
    }).required("Obrigatório selecionar produto"),
    unitary_value: Yup.number()
        .default(0)
        .required("Obrigatório informar quantidade solicitada do produto")
        .positive("Valor unitário deve ser positivo!"),
    amount: Yup.number()
        .default(0)
        .required("Obrigatório informar quantidade solicitada do produto")
        .positive("A quantidade deve ser positiva!"),
    declared_production_cost: Yup.number()
        .default(0)
        .required("Obrigatório informar quantidade solicitada do produto")
        .positive("A quantidade deve ser positiva!"),
    notes: Yup.string().optional().default(""),
    file_path: Yup.string().optional().default(""),
    file_link: Yup.string().optional().default("")
});