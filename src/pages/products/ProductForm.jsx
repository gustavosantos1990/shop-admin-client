import React, { useRef, useState, useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from "primereact/toast";
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { useNavigate, useMatch } from 'react-location';
import productSchema from "../../schemas/ProductSchema";
import { saveNewProduct, updateProduct } from "../../services/ProductService";
import { isInvalid } from "../../components/Utils";

export default function ProductForm() {

    const routeDate = useMatch();
    const navigate = useNavigate();
    const toastRef = useRef(null);
    const [isNewRecord, setIsNewRecord] = useState(routeDate.params.id === "novo" || routeDate.params.id === "undefined" || routeDate.params.id === "null");
    const [product, setProduct] = useState(routeDate.data.product);

    const { control, formState: { errors }, handleSubmit, reset, getValues } = useForm(
        {
            defaultValues: productSchema.cast(),
            mode: "onBlur",
            resolver: yupResolver(productSchema)
        }
    );

    useEffect(() => {
        if (isNewRecord) {
            console.log("Starting product form for new product");
        } else {
            console.log("Starting product form for existing product");
            setProduct(product)
        }
    }, []);

    useEffect(() => {
        if (isNewRecord === false) {
            reset(Object.assign(product, { description: "" }))
        }
    }, [isNewRecord]);


    const onSubmit = data => {
        const request = isNewRecord ? saveNewProduct : updateProduct;
        const successMessage = isNewRecord ? "Produto salvo com sucesso." : "Produto atualizado com sucesso."
        request(data).then(async res => {
            var json = await res.json();
            if (res.ok) {
                toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: successMessage, life: 3000 });
                navigate({ to: `/produtos`, replace: true });
            } else {
                toastRef.current.show({ severity: 'error', summary: 'Erro!', detail: json.message });
            }
        });
    };

    const getFormErrorMessage = path => {
        var value = path.split('.').reduce((o, p) => o && o[p], errors);
        return value && <small className="p-error">{value.message}</small>;
    };

    const start = () => <>
        <Button
            type="button"
            icon="pi pi-arrow-left"
            onClick={() => navigate({ to: `/produtos`, replace: true })}
        />
    </>;

    const end = () => <>
        <Button
            label="Salvar"
            type="submit"
            icon="pi pi-save"
            iconPos="right"
            className="p-button-success" />
    </>;

    return (
        <>
            <div className="content">
                <Toast ref={toastRef} />
                <h2>Cadastro de Produtos</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Toolbar className="p-1 m-1" start={start} end={end} />
                    <div className="card p-2">
                        <div className="p-fluid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Nome*</label>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field}
                                            value={field.value}
                                            onChange={e => field.onChange(e.target.value)}
                                            className={classNames({ 'p-invalid': fieldState.error })} />
                                    )} />
                                {getFormErrorMessage('name')}
                            </div>
                        </div>
                        <div className="p-fluid grid">
                            <div className="field col-6 md:col-3">
                                <label htmlFor="price" className={classNames({ 'p-error': errors.price })}>Preço*</label>
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field, fieldState }) =>
                                        <InputNumber id={field.name} {...field}
                                            onChange={(e) => field.onChange(e.value)}
                                            mode="currency" currency="BRL" locale="pt-BR"
                                            className={classNames({ 'p-invalid': fieldState.error })} />
                                    } />
                                {getFormErrorMessage('price')}
                            </div>
                        </div>
                        <div className="p-fluid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="description" className={classNames({ 'p-error': errors.description })}>Descrição</label>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <InputTextarea id={field.name} {...field}
                                            value={field.value}
                                            rows={5}
                                            onChange={e => field.onChange(e.target.value)} />
                                    )} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};