import * as Yup from "yup";

export default Yup.object().shape({
    due_date: Yup.date()
        .default(new Date())
        .required('Obrigatório informar data de entrega!'),
    notes: Yup.string().optional().default("")
});