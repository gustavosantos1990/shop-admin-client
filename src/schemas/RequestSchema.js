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
            .required("Obrigatório informar telefone do cliente"),
        name: Yup.string()
            .default("")
            .required("Obrigatório informar nome do cliente")
    }).required("Obrigatório informar dados do cliente!"),/*,
    request_products: Yup.array()
        .of(Yup.object().shape({
            phone: Yup.number()
                .default(0)
                .required("Obrigatório informar quantidade solicitada do produto"),
            unitary_value: Yup.number()
                .default(0)
                .required("Obrigatório informar quantidade solicitada do produto"),
            product: Yup.object().shape({
                id: Yup.string()
                    .required("Obrigatório informar ID do produto")
            })
        }))
        .required("Obrigatório informar listagem de produtos!")
        .min(1, "Obrigatório informar ao menos um produto!")
*/
});