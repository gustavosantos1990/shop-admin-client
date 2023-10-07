import React, { useRef, useState, useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from "primereact/toast";
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { useNavigate, useMatch } from 'react-location';
import productSchema from "../../schemas/ProductSchema";
import { saveNewProduct } from "../../services/ProductService";
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

    /*
    useEffect(() => {
        console.log(product);
        setIsNewRecord(isInvalid(product) || isInvalid(product.product_id))
    }, [product]);
    */

    
    useEffect(() => {
        if (isNewRecord === false) {
            reset(product);
        }
    }, [isNewRecord]);


    const onSubmit = data => {
        console.log(data);
        saveNewProduct(data).then(async res => {
            var json = await res.json();
            console.log(json);
            if (res.ok) {
                toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: "Produto salvo com sucesso.", life: 3000 });
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

    const rightToolbar = () => <React.Fragment>
        <Button
            label="Salvar"
            type="submit"
            icon="pi pi-save"
            iconPos="right"
            className="p-button-success ml-2 mt-2" />
    </React.Fragment>;

    return (
        <>
            <div className="content">
                <Toast ref={toastRef} />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Toolbar className="p-1 mb-2" right={rightToolbar} />
                    <div className="card p-2">
                        <div className="p-fluid grid">
                            <div className="field col-12 md:col-9">
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
                    </div>
                </form>
            </div>
        </>
    );
};