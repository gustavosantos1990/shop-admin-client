import React, { useRef, useState, useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, useFieldArray, useFormState } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Divider } from 'primereact/divider';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { useNavigate, useMatch } from 'react-location';
import requestSchema from "../../schemas/RequestSchema";
import { saveNewRequest, updateRequest } from "../../services/RequestService";
import { getCustomersByPhone } from "../../services/CustomerService";
import { convertDate, formatToBRCurrency, formatToBRDateTime } from "../../components/Utils";
import "./RequestForm.css";

export default function RequestForm() {

    const currencyProperties = {
        mode: "currency",
        currency: "BRL",
        locale: "pt-BR",
        minFractionDigits: 2,
        maxFractionDigits: 2
    };

    const routeData = useMatch();
    const navigate = useNavigate();
    const toastRef = useRef(null);
    const [isNewRecord] = useState(routeData.params.id === "novo" || routeData.params.id === "undefined" || routeData.params.id === "null");
    const [request, setRequest] = useState(routeData.data.request);
    const [products] = useState(routeData.data.products);

    const { control, handleSubmit, reset, getValues, watch } = useForm(
        {
            defaultValues: isNewRecord ? requestSchema.cast() : request,
            mode: "onBlur",
            resolver: yupResolver(requestSchema)
        }
    );
    const { fields, append, remove } = useFieldArray({ name: 'request_products', control });
    const { errors } = useFormState({
        control
    });

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
        <Button raised
            label="Salvar"
            type="submit"
            icon="pi pi-save"
            iconPos="right"
            className="p-button-success" />
    </>;

    const appendProduct = () => {
        append({});
    };

    function updateProduct(event, field, i) {
        console.log(event);
        field.onChange(event.value);
        console.log(fields[i].product)
    }

    return (
        <>
            <div className="content">
                <Toast ref={toastRef} />
                <h2>{isNewRecord ? "Novo pedido" : "Atualizar pedido"}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Toolbar className="p-1 m-1" start={start} end={end} />
                    <div className="card p-2">
                        <div className="p-fluid grid">
                            <div className="field col-6 lg:col-2 md:col-3">
                                <label htmlFor="due_date" className={classNames({ 'p-error': errors.due_date })}>Data de Entrega</label>
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
                            <div className="field col-6 lg:col-2">
                                <label htmlFor="customer.phone" className={classNames({ 'p-error': errors.customer && errors.customer.phone })}>Telefone*</label>
                                <Controller
                                    name="customer.phone"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <div className="p-inputgroup flex-1">
                                            <InputText id={field.name} {...field}
                                                keyfilter="int"
                                                value={field.value}
                                                onChange={e => field.onChange(e.target.value)}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                                maxLength={11}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (field.value.length > 10) {
                                                            findCustomerByPhone(field.value);
                                                        }
                                                    }
                                                }}
                                            />
                                            <Button raised
                                                icon="pi pi-search"
                                                type="button"
                                                disabled={field.value.length < 10}
                                                onClick={findCustomerByPhone}
                                            />
                                        </div>
                                    )} />
                                {getFormErrorMessage('customer.phone')}
                            </div>
                        </div>
                        <div className="p-fluid grid">
                            <div className="field col-6 md:col-4">
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
                            <div className="field col-3">
                                <label htmlFor="custome_.created_at">Cadastrado em</label>
                                <InputText id="created_at" disabled value={getValues().customer?.id ? formatToBRDateTime(getValues().customer.created_at) : "Novo cadastro"} />
                            </div>
                        </div>
                        <div className="p-fluid grid">
                            <div className="field col-6 md:col-4">
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
                        <Divider />
                        <div className="flex justify-content-center">
                            <div className="p-datatable p-component p-datatable-responsive-scroll p-datatable-gridlines">
                                <div className="p-datatable-header">
                                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                                        <span className="">PRODUTOS</span>
                                        <Button raised
                                            type="button"
                                            icon="pi pi-plus"
                                            label="Add produto"
                                            size="small" rounded
                                            onClick={appendProduct} />
                                    </div>
                                </div>
                                <div className="p-datatable-wrapper">
                                    <table className="p-datatable-table">
                                        <thead className="p-datatable-thead">
                                            <tr>
                                                <th className="w-6">
                                                    <div className="p-column-header-content">
                                                        <span className="p-column-title">Item</span>
                                                    </div>
                                                </th>
                                                <th className="w-2">
                                                    <div className="p-column-header-content">
                                                        <span className="p-column-title">Valor Unitário</span></div>
                                                </th>
                                                <th className="w-2">
                                                    <div className="p-column-header-content">
                                                        <span className="p-column-title">Quantidade</span>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className="p-column-header-content">
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="p-datatable-tbody">
                                            {fields.map((item, i) => (
                                                <tr key={i}>
                                                    <td>
                                                        <Controller
                                                            name={`request_products.${i}.product`}
                                                            control={control}
                                                            render={({ field, fieldState }) =>
                                                                <div>
                                                                    <div>
                                                                        <Dropdown
                                                                            id={field.name}
                                                                            {...field}
                                                                            //control={control}
                                                                            //value={fields[i].product}
                                                                            //TODO: replace watch by...
                                                                            value={watch(`request_products[${i}].product`)}
                                                                            disabled={watch(`request_products[${i}].product`)}
                                                                            options={products}
                                                                            //{...register(field.name, { required: true })}
                                                                            onChange={e => {
                                                                                fields[i].product = e.value;
                                                                                fields[i].unitary_value = e.value.price;
                                                                                reset(Object.assign(getValues(), { request_products: fields }))
                                                                            }}
                                                                            //onChange={e => updateProduct(e, field, i)}
                                                                            //onSelect={e => console.log(e)}
                                                                            placeholder="Selecione um produto"
                                                                            optionLabel="name"
                                                                            className={classNames({ 'p-invalid': fieldState.error })} />
                                                                    </div>
                                                                    <div>
                                                                        <small className="p-error">{errors.request_products?.[i]?.product?.id.message}</small>
                                                                    </div>
                                                                </div>
                                                            } />
                                                    </td>
                                                    <td>
                                                        <Controller
                                                            name={`request_products.${i}.unitary_value`}
                                                            control={control}
                                                            render={({ field, fieldState }) =>
                                                                <div>
                                                                    <div>
                                                                        <InputNumber
                                                                            id={field.name}
                                                                            {...field}
                                                                            {...currencyProperties}
                                                                            value={fields[i].unitary_value}
                                                                            //TODO: replace watch by...
                                                                            //disabled={!fields[i].product}
                                                                            disabled={!watch(`request_products[${i}].product`)?.id}
                                                                            onChange={e => field.onChange(e.value)}
                                                                            className={classNames({ 'p-invalid': fieldState.error })} />
                                                                    </div>
                                                                    <div>
                                                                        <small className="p-error">{errors.request_products?.[i]?.unitary_value?.message}</small>
                                                                    </div>
                                                                </div>

                                                            } />
                                                    </td>
                                                    <td>
                                                        <Controller
                                                            name={`request_products.${i}.amount`}
                                                            control={control}
                                                            render={({ field, fieldState }) =>
                                                                <div>
                                                                    <div>
                                                                        <InputNumber
                                                                            id={field.name}
                                                                            {...field}
                                                                            value={fields[i].amount}
                                                                            //TODO: replace watch by...
                                                                            //disabled={!fields[i].product}
                                                                            disabled={!watch(`request_products[${i}].product`)?.id}
                                                                            onChange={e => field.onChange(e.value)}
                                                                            className={classNames({ 'p-invalid': fieldState.error })} />
                                                                    </div>
                                                                    <div>
                                                                        <small className="p-error">{errors.request_products?.[i]?.amount?.message}</small>
                                                                    </div>
                                                                </div>
                                                            } />
                                                    </td>
                                                    <td>
                                                        <Button raised
                                                            type="button"
                                                            severity="warning"
                                                            icon="pi pi-trash"
                                                            size="small" rounded
                                                            onClick={() => remove(i)} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="p-datatable-tfoot">
                                            <tr>
                                                <td role="cell" colSpan="1">Total:</td>
                                                <td role="cell">{formatToBRCurrency(watch("request_products")?.filter(rp => rp.unitary_value > 0 && rp.amount > 0).reduce((prevVal, rp) => prevVal + (rp.unitary_value * rp.amount), 0))}</td>
                                                <td role="cell" colSpan="2"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <small className="p-error">{errors.request_products?.message}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};