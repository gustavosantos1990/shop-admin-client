import * as Yup from "yup";

export default Yup.object().shape({
    name: Yup.string()
        .default(`${Date.now()}`)
        .min(2, "Tamanho inválido.")
        .required('Obrigatório informar o nome do produto!'),
    price: Yup.number()
        .default(10.00)
        .positive("O preço deve possuir um valor positivo!")
        .required("Obrigatório informar preço!"),
    description: Yup.string().default(""),
    photo: Yup.string()
});