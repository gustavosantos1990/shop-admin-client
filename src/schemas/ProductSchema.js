import * as Yup from "yup";

export default Yup.object().shape({
    name: Yup.string()
        .default("")
        .min(2, "Tamanho inválido.")
        .required('Obrigatório informar o nome do produto!'),
    price: Yup.number()
        .default(0.00)
        .positive("O preço deve possuir um valor positivo!")
        .required("Obrigatório informar preço!"),
    description: Yup.string().default(""),
    photo: Yup.string()
});