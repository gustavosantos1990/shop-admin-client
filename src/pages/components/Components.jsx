import React, { useState, useEffect, useRef } from "react";
<<<<<<< HEAD
import { Card } from 'primereact/card';
=======
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d
import { useMatch, useNavigate } from "react-location";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
<<<<<<< HEAD
import { OverlayPanel } from 'primereact/overlaypanel';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from "primereact/dialog";
import { FilterMatchMode } from 'primereact/api';
import "./Components.css";
import { formatToBRDateTime, formatToBRCurrency } from "../../components/Utils";
import { deleteComponent, getComponents, saveNewComponent } from "../../services/ComponentService";

export default function Components() {

    const initialData = useMatch().data.components;
=======
import { classNames } from 'primereact/utils';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from 'primereact/api';
import "./Components.css";
import { formatToBRDateTime, formatToBRCurrency } from "../../components/Utils";
import { deleteComponent, getComponents, saveNewComponent, updateComponent } from "../../services/ComponentService";
import componentSchema from "../../schemas/ComponentSchema";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";

export default function Components() {

    const initialData = useMatch().data;
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d
    const navigate = useNavigate();
    const overlayPanelRef = useRef(null);
    const toastRef = useRef(null);
    const [components, setComponents] = useState([]);
<<<<<<< HEAD
    const [selected, setSelected] = useState(null);
    const [visible, setVisible] = useState(false);
    const [filters, setFilters] = useState({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        setComponents(initialData);
=======
    const [measures, setMeasures] = useState([]);
    const [selected, setSelected] = useState(null);
    const [visible, setVisible] = useState(false);
    const [filters, setFilters] = useState({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const { control, handleSubmit, formState: { errors }, reset, getValues, watch } = useForm(
        {
            defaultValues: componentSchema.cast(),
            mode: "onBlur",
            resolver: yupResolver(componentSchema)
        }
    );

    useEffect(() => {
        setComponents(initialData.components);
        setMeasures(initialData.measures);
        console.log(measures);
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d
    }, []);

    useEffect(() => {
    }, [selected]);

    const fetchComponents = async () => {
        getComponents()
            .then(res => res.json())
            .then(res => setComponents(res));
    };

    const tableHeader = () => {
        return (
            <div className="flex justify-content-between">
<<<<<<< HEAD
                <div>
=======
                <div className="flex gap-1">
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d
                    <div>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pesquisar" />
                        </span>
                    </div>
<<<<<<< HEAD

=======
                    <Button
                        label="Novo"
                        severity="info"
                        icon="pi pi-plus"
                        onClick={() => openDialogForNewComponent()}
                    />
                    <Button
                        label="Editar"
                        icon="pi pi-pencil"
                        disabled={!selected}
                        onClick={() => openDialogForUpdate()}
                    />
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d
                </div>
                <div className="flex justify-content-start gap-1">
                    <Button icon="pi pi-filter" onClick={(e) => overlayPanelRef.current.toggle(e)} />
                    <OverlayPanel ref={overlayPanelRef}>
                        <div className="">
                            <div className="field-checkbox">
                                <Checkbox inputId="includeDeletedFilter" />
                                <label htmlFor="includeDeletedFilter">Exibir deletados?</label>
                            </div>
                        </div>
                    </OverlayPanel>
                    <Button icon="pi pi-refresh" onClick={() => fetchComponents()} />
                </div>
            </div>
        );
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

<<<<<<< HEAD
    const sendToForm = e => {
        navigate({ to: e.data.id, replace: true })
    };

=======
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d
    const deleteSelectedComponent = () => {
        deleteComponent(selected.id)
            .then(res => {
                if (res.ok) {
                    fetchComponents();
                    toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: "Componente deletado!", life: 3000 });
                } else {
                    res.json().then(json => {
                        console.log(json);
                        toastRef.current.show({
                            severity: 'error',
                            summary: 'Erro!',
                            detail: json.message,
                            life: 3000
                        });
                    });
                }
            })
    };

    const showDeleteConfirmationDialog = () => {
        confirmDialog({
            message: 'Deseja realmente deletar este componente?',
            header: 'Confirmar exclusão',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            acceptLabel: "Sim",
            rejectLabel: "Não",
            accept: deleteSelectedComponent,
            reject: () => { }
        });
    };

    const openDialogForNewComponent = () => {
<<<<<<< HEAD
        setVisible(true);
    }
=======
        reset(componentSchema.cast())
        setVisible(true);
        setSelected(null);
    };

    const openDialogForUpdate = () => {
        reset(selected)
        setVisible(true);
        setSelected(null);
    };

    const openDialogForUpdateSelected = e => {
        reset(e.data)
        setVisible(true);
    };

    const getFormErrorMessage = path => {
        var value = path.split('.').reduce((o, p) => o && o[p], errors);
        return value && <small className="p-error">{value.message}</small>;
    };


    const onSubmit = data => {
        console.log("onSubmit -> " + JSON.stringify(data));
        const isNewRecord = data.id === null || data.id === undefined;
        const request = isNewRecord ? saveNewComponent : updateComponent;
        const successMessage = isNewRecord ? "Componente salvo com sucesso." : "Componente atualizado com sucesso."
        request(data).then(async res => {
            var json = await res.json();
            if (res.ok) {
                toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: successMessage, life: 3000 });
                fetchComponents();
                setVisible(false);
            } else {
                toastRef.current.show({ severity: 'error', summary: 'Erro!', detail: json.message });
            }
        });
    };
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d

    return (
        <>
            <div className="content mx-8">
                <Toast ref={toastRef} />
                <ConfirmDialog />
                <h2>Cadastro de Componentes</h2>
<<<<<<< HEAD
                <Card className="my-3">
                    <div>
                        <Button
                            label="Novo Componente"
                            severity="info"
                            icon="pi pi-plus"
                            onClick={() => openDialogForNewComponent()}
                        />
                        <Button
                            label="Editar"
                            icon="pi pi-pencil"
                            className="ml-1"
                            disabled={!selected}
                            onClick={() => navigate({ to: selected.id, replace: true })}
                        />
                        <Button
                            label="Deletar"
                            icon="pi pi-trash"
                            className="ml-1"
                            disabled={selected === null}
                            severity="warning"
                            onClick={() => showDeleteConfirmationDialog()}
                        />
                        <Button
                            label="Calculadora"
                            icon="fa-solid fa-calculator"
                            className="ml-1"
                            disabled={selected === null}
                        />
                    </div>
                </Card>
=======
                <div className="m-2">
                    <Button
                        label="Deletar"
                        icon="pi pi-trash"
                        className="ml-1"
                        disabled={!selected}
                        severity="warning"
                        visible={false}
                        onClick={() => showDeleteConfirmationDialog()}
                    />
                    <Button
                        label="Calculadora"
                        icon="fa-solid fa-calculator"
                        className="ml-1"
                        disabled={selected === null}
                        visible={false}
                    />
                </div>
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d
                <div className="scrollable">
                    <DataTable
                        value={components}
                        scrollable
                        showGridlines
                        rowHover
                        dataKey="id"
                        selectionMode="single"
                        selection={selected}
                        onSelectionChange={(e) => setSelected(e.value)}
<<<<<<< HEAD
                        onRowDoubleClick={sendToForm}
=======
                        onRowDoubleClick={openDialogForUpdateSelected}
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d
                        filters={filters}
                        header={tableHeader}
                        emptyMessage="Sem resultados..."
                    >
                        <Column header="Nome" field="name" style={{ width: '30%' }} ></Column>
                        <Column header="Criado em" body={row => formatToBRDateTime(row.created_at)} ></Column>
<<<<<<< HEAD
                        <Column header="Medida" field="measure.label" ></Column>
                        <Column header="Símbolo" field="measure.symbol" ></Column>
                        <Column header="Altura" body={row => row.measure.multi_dimension ? row.base_buy_height.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : <div className="text-gray-300">{"n/a"}</div>} ></Column>
                        <Column header="Largura" body={row => row.measure.multi_dimension ? row.base_buy_width.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : <div className="text-gray-300">{"n/a"}</div>} ></Column>
                        <Column header="Quantidade" body={row => row.base_buy_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ></Column>
=======
                        <Column header="Medida" field="measure.name" ></Column>
                        <Column header="Símbolo" field="measure.symbol" ></Column>
                        <Column header="Altura" body={row => row.measure.multi_dimension ? row.base_buy_height.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : <div className="text-gray-300">{"n/a"}</div>} ></Column>
                        <Column header="Largura" body={row => row.measure.multi_dimension ? row.base_buy_width.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : <div className="text-gray-300">{"n/a"}</div>} ></Column>
                        <Column header="Quantidade" body={row => `${row.base_buy_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ${row.measure.symbol}`} ></Column>
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d
                        <Column header="Valor Pago" body={row => formatToBRCurrency(row.base_buy_paid_value, 2, 2)} ></Column>
                    </DataTable>
                </div>
            </div>
            <Dialog
                header="Componentes"
                visible={visible}
                style={{ width: '50vw', minHeight: '60vh' }}
                onHide={() => setVisible(false)}
<<<<<<< HEAD
                /* footer={<div>
                    <Button
                    label="Cancelar"
                    icon="pi pi-ban"
                    severity="danger"
                    type="button"
                    onClick={() => setVisible(false)} />
                    </div>} */
                position="top-right"
                draggable={false}
            >

            </Dialog>
=======
                position="top-right"
                draggable={false}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="">
                        <div className="card p-2">
                            <div className="p-fluid grid">
                                <div className="field col-8">
                                    <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Nome*</label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <InputText
                                                id={field.name}
                                                {...field}
                                                value={field.value}
                                                disabled={watch("id")}
                                                onChange={e => field.onChange(e.target.value)}
                                                className={classNames({ 'p-invalid': fieldState.error })} />
                                        )} />
                                    {getFormErrorMessage('name')}
                                </div>
                                <div className="field col-4">
                                    <label htmlFor="measure" className={classNames({ 'p-error': errors.measure })}>Medida*</label>
                                    <Controller
                                        name="measure"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Dropdown
                                                id={field.name}
                                                {...field}
                                                value={field.value}
                                                disabled={watch("id")}
                                                options={measures}
                                                optionLabel="name"
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                                onChange={(e) => field.onChange(e.value)}
                                                placeholder="Selecione uma medida"
                                            //onChange={(e) => {console.log(field); console.log(measures.find(m => m.value === e.value)); field.onChange(measures.find(m => m.value === e.value))}}
                                            />
                                        )} />
                                    {getFormErrorMessage('measure')}
                                    {getFormErrorMessage('measure.value')}
                                    {getFormErrorMessage('measure.multi_dimension')}
                                </div>
                            </div>
                            <Divider align="left">
                                <div className="inline-flex align-items-center">
                                    <i className="fa-solid fa-cart-shopping mr-2"></i>
                                    <b>Última compra realizada</b>
                                </div>
                            </Divider>
                            {watch("measure")?.multi_dimension === true
                                ? <div className="p-fluid grid">
                                    <div className="field col-4">
                                        <label htmlFor="base_buy_height" className={classNames({ 'p-error': errors.base_buy_height })}>Altura*</label>
                                        <Controller
                                            name="base_buy_height"
                                            control={control}
                                            render={({ field, fieldState }) =>
                                                <InputNumber
                                                    id={field.name}
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    locale="pt-BR"
                                                    maxFractionDigits={2}
                                                    minFractionDigits={2}
                                                    className={classNames({ 'p-invalid': fieldState.error })} />
                                            } />
                                        {getFormErrorMessage('base_buy_height')}
                                    </div>
                                    <div className="field col-4">
                                        <label htmlFor="base_buy_width" className={classNames({ 'p-error': errors.base_buy_width })}>Largura*</label>
                                        <Controller
                                            name="base_buy_width"
                                            control={control}
                                            render={({ field, fieldState }) =>
                                                <InputNumber id={field.name} {...field}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    locale="pt-BR"
                                                    maxFractionDigits={2}
                                                    minFractionDigits={2}
                                                    className={classNames({ 'p-invalid': fieldState.error })} />
                                            } />
                                        {getFormErrorMessage('base_buy_width')}
                                    </div>
                                    <div className="field col-3">
                                        <label htmlFor="base_buy_amount">Quantidade</label>
                                        <InputNumber
                                            id="base_buy_amount"
                                            readOnly
                                            locale="pt-BR"
                                            maxFractionDigits={2}
                                            minFractionDigits={2}
                                            disabled
                                            value={watch('base_buy_height') * watch('base_buy_width')}
                                        />
                                    </div>
                                </div>
                                : <div className="p-fluid grid">
                                    <div className="field col-4">
                                        <label htmlFor="base_buy_amount" className={classNames({ 'p-error': errors.base_buy_amount })}>Quantidade*</label>
                                        <Controller
                                            name="base_buy_amount"
                                            control={control}
                                            render={({ field, fieldState }) =>
                                                <InputNumber
                                                    id={field.name}
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    locale="pt-BR"
                                                    maxFractionDigits={2}
                                                    minFractionDigits={2}
                                                    className={classNames({ 'p-invalid': fieldState.error })} />
                                            } />
                                        {getFormErrorMessage('base_buy_amount')}
                                    </div>
                                </div>
                            }
                            <div className="p-fluid grid">
                                <div className="field col-4">
                                    <label htmlFor="base_buy_paid_value" className={classNames({ 'p-error': errors.base_buy_paid_value })}>Valor Pago*</label>
                                    <Controller
                                        name="base_buy_paid_value"
                                        control={control}
                                        render={({ field, fieldState }) =>
                                            <InputNumber id={field.name} {...field}
                                                onChange={(e) => field.onChange(e.value)}
                                                locale="pt-BR"
                                                mode="currency"
                                                currency="BRL"
                                                maxFractionDigits={2}
                                                minFractionDigits={2}
                                                className={classNames({ 'p-invalid': fieldState.error })} />
                                        } />
                                    {getFormErrorMessage('base_buy_paid_value')}
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button
                                label="Salvar"
                                type="submit"
                                icon="pi pi-save"
                                iconPos="right"
                                className="p-button-success"
                            />
                            <Button
                                className="ml-2"
                                icon="pi pi-eye"
                                type="button"
                                onClick={() => { console.log(errors); console.log(getValues()) }}
                            />
                        </div>
                    </div>
                </form >
            </Dialog >
>>>>>>> c6733e2a8a4622732fd795b7fd3df67f5891a98d
        </>
    );
}