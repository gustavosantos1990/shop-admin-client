import * as Yup from "yup";

export default Yup.object().shape({
    due_date: Yup.date()
        .default(new Date())
        .required('Obrigatório informar data de entrega!'),
    notes: Yup.string().default(""),
    customer: Yup.object().shape({
        id: Yup.string()
            .optional(),
        phone: Yup.string()
            .default("")
            .required("Obrigatório informar telefone do cliente")
            .min(10)
            .max(11),
        name: Yup.string()
            .default("")
            .min(2, "Nome deve possuir ao menos dois caracteres")
            .required("Obrigatório informar nome do cliente"),
        created_at: Yup.string()
            .optional()
    }).required("Obrigatório informar dados do cliente!"),
    request_products: Yup.array()
        .of(Yup.object().shape({
            unitary_value: Yup.number()
                .default(0)
                .required("Obrigatório informar quantidade solicitada do produto")
                .positive("Valor unitário deve ser positivo!"),
            amount: Yup.number()
                .default(0)
                .required("Obrigatório informar quantidade solicitada do produto")
                .positive("A quantidade deve ser positiva!"),
            product: Yup.object().shape({
                id: Yup.string()
                    .default("")
                    .required("Obrigatório selecionar produto"),
                name: Yup.string()
                    .default("")
                    .optional(),
                price: Yup.number()
                    .default(0)
                    .optional(),
                created_at: Yup.string()
                    .default("")
                    .optional(),
                updated_at: Yup.string()
                    .default("")
                    .optional()
            }).required("Obrigatório selecionar produto")
        }))
        .default([])
        .required("Obrigatório informar listagem de produtos!")
        .min(1, "Obrigatório informar ao menos um produto!")
});