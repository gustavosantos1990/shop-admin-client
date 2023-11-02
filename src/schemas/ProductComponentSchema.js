import * as Yup from "yup";

export const productComponentMultiDimensionMeasureSchema = Yup.object().shape({
    component: Yup.object().shape({
        id: Yup.string()
            .default("")
            .required('Obrigatório informar o componente!')
    }).required('Obrigatório informar o componente!'),
    height: Yup.number()
        .default(0.00)
        .positive("Altura deve ser positiva!")
        .required("Obrigatório informar altura!"),
    width: Yup.number()
        .default(0.00)
        .positive("Largura deve ser positiva!")
        .required("Obrigatório informar largura!"),
    amount: Yup.number().default(0.00)
});

export const productComponentSchema = Yup.object().shape({
    component: Yup.object().shape({
        id: Yup.string()
            .default("")
            .required('Obrigatório informar o componente!')
    }).required('Obrigatório informar o componente!'),
    height: Yup.number().default(0.00),
    width: Yup.number().default(0.00),
    amount: Yup.number()
        .default(0.00)
        .positive("Quantidade deve ser positiva!")
        .required("Obrigatório informar quantidade!"),
});