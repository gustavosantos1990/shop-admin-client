import React, { useRef, useState, useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { useNavigate, useMatch } from 'react-location';
import requestSchema from "../../schemas/RequestSchema";
import { saveNewRequest } from "../../services/RequestService";
import { getCustomersByPhone } from "../../services/CustomerService";
import { convertDate, formatToBRDateTime } from "../../components/Utils";
import "./NewRequestForm.css";

export default function RequestForm() {

    const navigate = useNavigate();
    const toastRef = useRef(null);
    const { control, handleSubmit, reset, getValues, formState: { errors } } = useForm(
        {
            defaultValues: requestSchema.cast(),
            mode: "onBlur",
            resolver: yupResolver(requestSchema)
        }
    );

    const findCustomerByPhone = () => {
        getCustomersByPhone(getValues().customer.phone)
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                if (res.status === 404) {
                    return {
                        name: getValues().customer.name,
                        phone: getValues().customer.phone
                    }
                }
            })
            .then(json => {
                console.log(json);
                reset(Object.assign(getValues(), { customer: json }));
            })
    };

    const onSubmit = data => {
        console.log("onSubmit -> " + JSON.stringify(data));
        saveNewRequest(data).then(async res => {
            var json = await res.json();
            if (res.ok) {
                navigate({ to: `/pedidos/${json.id}`, replace: true });
            } else {
                toastRef.current.show({ severity: 'error', summary: 'Erro!', detail: json.message });
            }
        });
    };

    const getFormErrorMessage = path => {
        var value = path.split('.').reduce((o, p) => o && o[p], errors);
        var result = value && <small className="p-error">{value.message}</small>;
        return errorComponent(result);
    };

    const errorComponent = message => <small className="p-error">{message}</small>;

    const showFormState = () => {
        console.log(JSON.stringify(getValues(), null, 2));
        console.log(JSON.stringify(errors, null, 2));
    }

    const start = () => <>
        <Button raised
            type="button"
            icon="pi pi-arrow-left"
            onClick={() => navigate({ to: `/pedidos`, replace: true })}
        />
    </>;

    const end = () => <>
        <Button raised
            className="mr-1"
            type="button"
            icon="pi pi-list"
            onClick={showFormState} />

    </>;

    return (
        <>
            <div className="content mx-8">
                <Toast ref={toastRef} />
                <h2>Novo pedido</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Toolbar className="p-1 m-1" start={start} end={end} />
                    <div className="card p-2">
                        <div className="p-fluid grid">
                            <div className="field col-6 lg:col-2 md:col-3">
                                <label htmlFor="due_date" className={classNames({ 'p-error': errors.due_date })}>Data de Entrega*</label>
                                <Controller
                                    name="due_date"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Calendar
                                            id={field.name}
                                            {...field}
                                            value={field.value instanceof Date ? field.value : convertDate(field.value)}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            readOnlyInput
                                            dateFormat="dd/mm/yy"
                                        />
                                    )} />
                                {getFormErrorMessage('due_date')}
                            </div>
                        </div>
                        <div className="p-fluid grid">
                            <div className="field col-6 lg:col-4">
                                <label htmlFor="customer.phone" className={classNames({ 'p-error': errors.customer && errors.customer.phone })}>Telefone*</label>
                                <Controller
                                    name="customer.phone"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <div className="p-inputgroup flex-1">
                                            <InputText
                                                id={field.name}
                                                {...field}
                                                keyfilter="int"
                                                value={field.value}
                                                onChange={e => field.onChange(e.target.value)}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                                maxLength={11}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (field.value?.length > 10) {
                                                            findCustomerByPhone(field.value);
                                                        }
                                                    }
                                                }}
                                            />
                                            <Button raised
                                                icon="pi pi-search"
                                                type="button"
                                                disabled={field.value?.length < 10}
                                                onClick={findCustomerByPhone}
                                            />
                                        </div>
                                    )} />
                                {getFormErrorMessage('customer.phone')}
                            </div>
                        </div>
                        <div className="p-fluid grid">
                            <div className="field col-10 md:col-4">
                                <label htmlFor="customer.name" className={classNames({ 'p-error': errors.customer && errors.customer.name })}>Nome*</label>
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
                            <div className="field col-6 md:col-3">
                                <label htmlFor="custome_.created_at">Cadastrado em</label>
                                <InputText id="created_at" disabled value={getValues().customer?.id ? formatToBRDateTime(getValues().customer.created_at) : "Novo cadastro"} />
                            </div>
                        </div>
                        <div className="p-fluid grid">
                            <div className="field col-10 md:col-4">
                                <label htmlFor="customer.facebook_chat_number" >Número do chat no Facebook/Messenger</label>
                                <Controller
                                    name="customer.facebook_chat_number"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-facebook"></i>
                                            </span>
                                            <InputText id={field.name} {...field}
                                                value={field.value}
                                                onChange={e => field.onChange(e.target.value)} />
                                        </div>
                                    )} />
                            </div>
                        </div>
                        <div className="p-fluid grid">
                            <div className="field col-10 md:col-6">
                                <label htmlFor="notes">Observações</label>
                                <Controller
                                    name="notes"
                                    control={control}
                                    render={({ field }) => (
                                        <InputTextarea id={field.name} {...field}
                                            value={field.value}
                                            onChange={e => field.onChange(e.target.value)} />
                                    )} />
                            </div>
                        </div>
                    </div>
                    <Button raised
                        label="Salvar"
                        type="submit"
                        icon="pi pi-save"
                        iconPos="right"
                        className="p-button-success"
                    />
                </form>
            </div>
        </>
    );
};