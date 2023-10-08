import React, { useRef, useState, useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { useNavigate, useMatch } from 'react-location';
import requestSchema from "../../schemas/RequestSchema";
import { saveNewRequest, updateRequest } from "../../services/RequestService";

export default function RequestForm() {

    const routeData = useMatch();
    const navigate = useNavigate();
    const toastRef = useRef(null);
    const [isNewRecord, setIsNewRecord] = useState(routeData.params.id === "novo" || routeData.params.id === "undefined" || routeData.params.id === "null");
    const [request, setRequest] = useState(routeData.data.request);
    const [products, setProducts] = useState(routeData.data.products);

    const { control, formState: { errors }, handleSubmit, reset, getValues } = useForm(
        {
            defaultValues: requestSchema.cast(),
            mode: "onBlur",
            resolver: yupResolver(requestSchema)
        }
    );

    useEffect(() => {
        console.log(errors);
        if (isNewRecord) {
            console.log("Starting request form for new request");
        } else {
            console.log("Starting request form for existing request");
            setRequest(request)
        }
    }, []);

    useEffect(() => {
        console.log("starting form")
        if (isNewRecord === false) {
            reset(request)
        }
    }, [isNewRecord]);


    const onSubmit = data => {
        const request = isNewRecord ? saveNewRequest : updateRequest;
        const successMessage = isNewRecord ? "Produto salvo com sucesso." : "Produto atualizado com sucesso."
        request(data).then(async res => {
            var json = await res.json();
            if (res.ok) {
                toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: successMessage, life: 3000 });
                navigate({ to: `/pedidos`, replace: true });
            } else {
                toastRef.current.show({ severity: 'error', summary: 'Erro!', detail: json.message });
            }
        });
    };

    const getFormErrorMessage = path => {
        console.log(errors);
        //var value = path.split('.').reduce((o, p) => o && o[p], errors);
        //return value && <small className="p-error">{value.message}</small>;
    };

    const start = () => <>
        <Button
            type="button"
            icon="pi pi-arrow-left"
            onClick={() => navigate({ to: `/pedidos`, replace: true })}
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
                <h2>{isNewRecord ? "Novo pedido" : "Atualizar pedido"}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Toolbar className="p-1 m-1" start={start} end={end} />
                    <div className="card p-2">
                        <div className="p-fluid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="due_date" className={classNames({ 'p-error': errors.due_date })}>Data de Entrega</label>
                                <Controller
                                    name="due_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Calendar id={field.name} {...field}
                                            value={field.value}
                                            dateFormat="dd/mm/yy"
                                            showButtonBar
                                            showIcon
                                            minDate={new Date()}
                                            onChange={e => field.onChange(e.value)}></Calendar>
                                    )} />
                                {getFormErrorMessage('due_date')}
                            </div>
                        </div>
                        <div className="p-fluid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="customer.phone" className={classNames({ 'p-error': errors.customer && errors.customer.phone })}>Telefone do cliente*</label>
                                <Controller
                                    name="customer.phone"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field}
                                            value={field.value}
                                            onChange={e => field.onChange(e.target.value)}
                                            className={classNames({ 'p-invalid': fieldState.error })} />
                                    )} />
                                {getFormErrorMessage('customer.phone')}
                            </div>
                            <div className="field col-12 md:col-6">
                                <label htmlFor="customer.name" className={classNames({ 'p-error': errors.customer && errors.customer.name })}>Nome do cliente*</label>
                                <Controller
                                    name="customer.name"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field}
                                            value={field.value}
                                            onChange={e => field.onChange(e.target.value)}
                                            className={classNames({ 'p-invalid': fieldState.error })} />
                                    )} />
                                {getFormErrorMessage('customer.name')}
                            </div>
                            {/*
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
                            </div>*/}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};