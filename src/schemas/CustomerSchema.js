import * as Yup from "yup";

export default Yup.object().shape({
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
    facebook_chat_number: Yup.string()
        .default("")
        .optional(),
    created_at: Yup.string()
        .optional()
});