import React, { useRef, useState, useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from "primereact/toast";
import { ContextMenu } from 'primereact/contextmenu';
import { Menu } from 'primereact/menu';
import { TabView, TabPanel } from 'primereact/tabview';
import { classNames } from 'primereact/utils';
import { useNavigate, useMatch } from 'react-location';
import productSchema from "../../schemas/ProductSchema";
import { productComponentMultiDimensionMeasureSchema, productComponentSchema } from "../../schemas/ProductComponentSchema";
import { getProductByID, saveNewProduct, updateProduct } from "../../services/ProductService";
import { getComponents } from "../../services/ComponentService";
import { formatToBRDateTime, formatToBRCurrency } from "../../components/Utils";
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import "./ProductForm.css";
import { deleteProductComponent, saveNewProductComponent, updateProductComponent } from "../../services/ProductComponentService";
import { Card } from "primereact/card";
import { Message } from "primereact/message";

export default function ProductForm() {

    const routeDate = useMatch();
    const navigate = useNavigate();
    const toastRef = useRef(null);
    const contextMenuRef = useRef(null);
    const [isNewRecord, setIsNewRecord] = useState(routeDate.params.id === "novo" || routeDate.params.id === "undefined" || routeDate.params.id === "null");
    const [product, setProduct] = useState(routeDate.data.product);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [selectedDialogComponent, setSelectedDialogComponent] = useState(null);
    const [openForUpdate, setOpenForUpdate] = useState(false);
    const [components, setComponents] = useState(null);
    const [formResolver, setFormResolver] = useState(null);
    const [visible, setVisible] = useState(false);
    const [filters, setFilters] = useState({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const {
        control,
        formState: { errors },
        handleSubmit, reset } = useForm({
            defaultValues: productSchema.cast(),
            mode: "onBlur",
            resolver: yupResolver(productSchema)
        });

    const {
        control: componentControl,
        formState: { errors: componentErrors },
        handleSubmit: handleComponentSubmit,
        watch: componentWatcher,
        reset: resetComponent } = useForm({
            defaultValues: formResolver?.cast(),
            mode: "onBlur",
            resolver: yupResolver(formResolver)
        });

    useEffect(() => {
        fetchComponents();
    }, []);

    useEffect(() => {
        if (isNewRecord) {
            console.log("Starting product form for new product");
        } else {
            console.log("Starting product form for existing product");
            reset(Object.assign(product))
        }
    }, [isNewRecord]);

    useEffect(() => {
        if (selectedDialogComponent != null && selectedDialogComponent !== undefined) {
            const isMulti = selectedDialogComponent.measure.multi_dimension === true;
            setFormResolver(isMulti
                ? productComponentMultiDimensionMeasureSchema
                : productComponentSchema);
            if (selectedComponent && openForUpdate) {
                resetComponent(selectedComponent);
                return;
            }
            console.log("reseting product component form, is multi? " + isMulti);
            var schema = isMulti
                ? productComponentMultiDimensionMeasureSchema
                : productComponentSchema;
            console.log(schema.cast());
            resetComponent(Object.assign(schema.cast(), { component: selectedDialogComponent }));
        }
    }, [selectedDialogComponent]);

    const fetchComponents = () => {
        getComponents()
            .then(res => res.json())
            .then(json => setComponents(json));
    }

    const fetchProduct = () => {
        getProductByID(product.id)
            .then(res => res.json())
            .then(json => setProduct(json));
    };

    const deleteSelectedProductComponent = () => {
        deleteProductComponent(product.id, selectedComponent.component.id)
            .then(res => {
                if (res.ok) {
                    setSelectedComponent(null);
                    fetchProduct();
                    toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: "Componente deletado com sucesso.", life: 3000 });
                }
            })
    }

    const onSubmit = data => {
        const request = isNewRecord ? saveNewProduct : updateProduct;
        const successMessage = isNewRecord ? "Produto salvo com sucesso." : "Produto atualizado com sucesso."
        request(data).then(async res => {
            var json = await res.json();
            if (res.ok) {
                toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: successMessage, life: 3000 });
                navigate({ to: `/produtos/${json.id}`, replace: true, fromCurrent: true });
                setProduct(json);
                setIsNewRecord(false);
            } else {
                toastRef.current.show({ severity: 'error', summary: 'Erro!', detail: json.message });
            }
        });
    };

    const onComponentSubmit = data => {
        const existingComponent = !product.components || product.components.length === 0 ? null : product.components.find(pc => pc.component.id === data.component.id);
        const isNewProductComponent = existingComponent === null || existingComponent === undefined;
        const promisse = isNewProductComponent
            ? saveNewProductComponent(product.id, data)
            : updateProductComponent(product.id, data.component.id, data);
        const successMessage = isNewProductComponent ? "Componente incluído com sucesso." : "Produto atualizado com sucesso."

        promisse.then(async res => {
            var json = await res.json();
            if (res.ok) {
                toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: successMessage, life: 3000 });
                setSelectedComponent(false);
                setVisible(false);
                fetchProduct();
            } else {
                toastRef.current.show({ severity: 'error', summary: 'Erro!', detail: json.message });
            }
        });
    };

    const getFormErrorMessage = path => {
        var value = path.split('.').reduce((o, p) => o && o[p], errors);
        return value && <small className="p-error">{value.message}</small>;
    };

    const getComponentFormErrorMessage = path => {
        var value = path.split('.').reduce((o, p) => o && o[p], componentErrors);
        return value && <small className="p-error">{value.message}</small>;
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const clearFilter = () => {
        let _filters = { ...filters };
        _filters['global'].value = "";
        setFilters(_filters);
        setGlobalFilterValue("");
    };

    const openComponentsDialog = () => {
        setOpenForUpdate(false);
        setSelectedDialogComponent(null);
        resetComponent(productComponentSchema.cast());
        setVisible(true);
        clearFilter();
    };

    const openComponentsDialogForUpdate = () => {
        setOpenForUpdate(true);
        setSelectedDialogComponent(selectedComponent.component);
        setVisible(true);
    };

    const openComponentsDialogForUpdateGivenProductComponent = productComponent => {
        setOpenForUpdate(true);
        setSelectedComponent(productComponent);
        setSelectedDialogComponent(productComponent.component);
        setVisible(true);
    };

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column header="Componente" rowSpan={3} />
            </Row>
            <Row>
                <Column header="Medida" colSpan={1} rowSpan={2} />
                <Column header="Compra Base" colSpan={2} style={{ 'textAlign': 'end' }} />
                <Column header="Altura" colSpan={1} rowSpan={2} />
                <Column header="Largura" colSpan={1} rowSpan={2} />
                <Column header="Quantidade" colSpan={1} rowSpan={2} style={{ 'textAlign': 'end' }} />
                <Column header="Valor" colSpan={1} rowSpan={2} />
            </Row>
            <Row>
                <Column header="Quantidade" rowSpan={1} />
                <Column header="Valor" rowSpan={1} />
            </Row>
        </ColumnGroup>
    );

    return (
        <>
            <div className="content mx-8">
                <Toast ref={toastRef} />
                <div className="flex justify-content-between align-content-end">
                    <h2>Cadastro de Produtos</h2>
                    <div className="flex align-content-center flex-wrap">
                        <Button
                            type="button"
                            icon="pi pi-arrow-left"
                            onClick={() => navigate({ to: `/produtos`, replace: true })}
                        />
                    </div>
                </div>

                <TabView>
                    <TabPanel header={isNewRecord ? "Novo Produto" : "Produto"} leftIcon="pi pi-calendar mr-2">
                        <form onSubmit={handleSubmit(onSubmit)}>
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
                            <Button
                                label="Salvar"
                                type="submit"
                                icon="pi pi-save"
                                iconPos="right"
                                className="p-button-success" />
                        </form>
                    </TabPanel>
                    {!isNewRecord &&
                        <TabPanel
                            header="Componentes"
                            leftIcon="pi pi-list mr-2"
                            disabled={isNewRecord}
                        >
                            <div className="flex">
                                <div className="mr-3">
                                    <h4>Total:</h4>
                                    <p className="text-2xl">{formatToBRCurrency(!product.components ? 0.00 : product.components.map(c => c.cost).reduce((prev, val) => prev + val, 0.00), 2, 2)}</p>
                                    <Menu model={[
                                        { label: 'Novo', icon: 'pi pi-fw pi-plus', command: () => openComponentsDialog() },
                                        { label: `Excluir`, icon: 'pi pi-fw pi-trash', disabled: !selectedComponent, command: () => deleteSelectedProductComponent() },
                                        { label: 'Editar', icon: 'pi pi-fw pi-pencil', disabled: !selectedComponent, command: () => openComponentsDialogForUpdate() }
                                    ]} />
                                </div>
                                <div className="scrollable">
                                    <ContextMenu model={[
                                        { label: 'Editar', icon: 'pi pi-fw pi-pencil', command: () => openComponentsDialogForUpdate() },
                                        { label: 'Excluir', icon: 'pi pi-fw pi-trash', command: () => deleteSelectedProductComponent() },
                                        { label: 'Limpar seleção', icon: 'pi pi-fw pi-ban', command: () => setSelectedComponent(null) }
                                    ]} ref={contextMenuRef} breakpoint="767px" />
                                    <Dialog
                                        header="Componentes"
                                        visible={visible}
                                        style={{ width: '50vw', minHeight: '60vh' }}
                                        onHide={() => setVisible(false)}
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
                                        <div>
                                            {(!selectedDialogComponent || !openForUpdate)
                                                ? <DataTable
                                                    value={components}
                                                    size="small"
                                                    dataKey="id"
                                                    selectionMode="single"
                                                    selection={selectedDialogComponent}
                                                    onSelectionChange={(e) => setSelectedDialogComponent(e.value)}
                                                    emptyMessage="Sem resultados..."
                                                    paginator
                                                    rows={5}
                                                    filters={filters}
                                                    header={<div className="flex justify-content-between">
                                                        <div>
                                                            <div>
                                                                <span className="p-input-icon-left">
                                                                    <i className="pi pi-search" />
                                                                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pesquisar" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>}
                                                >
                                                    <Column header="Componente" field="name" style={{ width: '30%' }} ></Column>
                                                    <Column header="Medida" field="measure.symbol" ></Column>
                                                    <Column header="Altura" body={row => row.measure.multi_dimension ? row.base_buy_height.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : <div className="text-gray-300">{"n/a"}</div>} ></Column>
                                                    <Column header="Largura" body={row => row.measure.multi_dimension ? row.base_buy_width.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : <div className="text-gray-300">{"n/a"}</div>} ></Column>
                                                    <Column header="Quantidade" body={row => row.base_buy_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ></Column>
                                                    <Column header="Valor Pago" body={row => formatToBRCurrency(row.base_buy_paid_value, 2, 2)} ></Column>
                                                </DataTable>
                                                : <Card title={selectedDialogComponent?.name} className="shadow-4">
                                                    {selectedDialogComponent && <div>
                                                        <p>Medida: {selectedDialogComponent.measure.label}</p>
                                                        {selectedDialogComponent.measure.multi_dimension && <>
                                                            <p>Altura: {selectedDialogComponent.base_buy_height.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                                                            <p>Largura: {selectedDialogComponent.base_buy_width.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                                                        </>}
                                                        <p>Quantidade comprada: {selectedDialogComponent.base_buy_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                                                        <p>Valor pago: {formatToBRCurrency(selectedDialogComponent.base_buy_paid_value)}</p>
                                                    </div>}
                                                </Card>
                                            }
                                        </div>
                                        {selectedDialogComponent && <h3>Quantidade</h3>}
                                        {selectedDialogComponent ? selectedDialogComponent?.measure.multi_dimension === true ?
                                            <form onSubmit={handleComponentSubmit(onComponentSubmit)}>
                                                <div className="p-fluid grid">
                                                    <div className="field col-3">
                                                        <label htmlFor="height" className={classNames({ 'p-error': componentErrors.height })}>Altura*</label>
                                                        <Controller
                                                            name="height"
                                                            control={componentControl}
                                                            render={({ field, fieldState }) =>
                                                                <InputNumber id={field.name} {...field}
                                                                    onChange={(e) => field.onChange(e.value)}
                                                                    locale="pt-BR"
                                                                    maxFractionDigits={2}
                                                                    minFractionDigits={2}
                                                                    className={classNames({ 'p-invalid': fieldState.error })} />
                                                            } />
                                                        {getComponentFormErrorMessage('height')}
                                                    </div>
                                                    <div className="field col-3">
                                                        <label htmlFor="width" className={classNames({ 'p-error': componentErrors.width })}>Largura*</label>
                                                        <Controller
                                                            name="width"
                                                            control={componentControl}
                                                            render={({ field, fieldState }) =>
                                                                <InputNumber id={field.name} {...field}
                                                                    onChange={(e) => field.onChange(e.value)}
                                                                    locale="pt-BR"
                                                                    maxFractionDigits={2}
                                                                    minFractionDigits={2}
                                                                    className={classNames({ 'p-invalid': fieldState.error })} />
                                                            } />
                                                        {getComponentFormErrorMessage('width')}
                                                    </div>
                                                    <div className="field col-3">
                                                        <label htmlFor="amount">Quantidade</label>
                                                        <InputNumber
                                                            id="amount"
                                                            readOnly
                                                            locale="pt-BR"
                                                            maxFractionDigits={2}
                                                            minFractionDigits={2}
                                                            disabled
                                                            value={componentWatcher('height') * componentWatcher('width')}
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    label="Salvar"
                                                    severity="success"
                                                    icon="pi pi-save"
                                                    type="submit"
                                                    disabled={selectedDialogComponent === null || selectedDialogComponent === undefined}
                                                />
                                                <Button
                                                    className="ml-2"
                                                    icon="pi pi-eye"
                                                    type="button"
                                                    visible={false}
                                                    onClick={() => console.log(componentErrors)}
                                                />
                                            </form>
                                            : <form onSubmit={handleComponentSubmit(onComponentSubmit)}>
                                                <div className="p-fluid grid">
                                                    <div className="field col-3">
                                                        <label htmlFor="amount" className={classNames({ 'p-error': componentErrors.amount })}>Quantidade*</label>
                                                        <Controller
                                                            name="amount"
                                                            control={componentControl}
                                                            render={({ field, fieldState }) =>
                                                                <InputNumber id={field.name} {...field}
                                                                    onChange={(e) => field.onChange(e.value)}
                                                                    locale="pt-BR"
                                                                    maxFractionDigits={2}
                                                                    minFractionDigits={2}
                                                                    className={classNames({ 'p-invalid': fieldState.error })} />
                                                            } />
                                                        {getComponentFormErrorMessage('amount')}
                                                    </div>
                                                </div>
                                                <Button
                                                    label="Salvar"
                                                    severity="success"
                                                    icon="pi pi-save"
                                                    type="submit"
                                                    disabled={selectedDialogComponent === null || selectedDialogComponent === undefined}
                                                />
                                                <Button
                                                    className="ml-2"
                                                    icon="pi pi-eye"
                                                    type="button"
                                                    visible={false}
                                                    onClick={() => console.log(componentErrors)}
                                                />
                                            </form>
                                            : <div className="mt-2 flex justify-content-center align-content-center flex-wrap" style={{ height: '20vh' }}>
                                                <div>
                                                    <Message text="Selecione um componente" severity="warn" />
                                                </div>
                                            </div>
                                        }
                                    </Dialog>
                                    <DataTable
                                        value={product.components}
                                        size="small"
                                        scrollable
                                        showGridlines
                                        rowHover
                                        dataKey="component.id"
                                        selectionMode="single"
                                        selection={selectedComponent}
                                        onSelectionChange={(e) => setSelectedComponent(e.value)}
                                        emptyMessage="Sem resultados..."
                                        headerColumnGroup={headerGroup}
                                        onContextMenu={(e) => { console.log(e); contextMenuRef.current.show(e.originalEvent) }}
                                        contextMenuSelection={selectedComponent}
                                        onContextMenuSelectionChange={(e) => setSelectedComponent(e.value)}
                                        onRowDoubleClick={evt => openComponentsDialogForUpdateGivenProductComponent(evt.data)}
                                    >
                                        <Column /* header="Componente" */ field="component.name" ></Column>
                                        <Column /* header="Medida" */ field="component.measure.symbol" ></Column>
                                        <Column /* header="Compra base - Quantidade" */ body={row => row.component.base_buy_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ></Column>
                                        <Column /* header="Compra base - Valor" */ body={row => formatToBRCurrency(row.component.base_buy_paid_value, 2, 2)} ></Column>
                                        <Column /* header="Altura" */ body={row => row.component.measure.multi_dimension ? row.height.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : <div className="text-gray-300">{"n/a"}</div>} ></Column>
                                        <Column /* header="Largura" */ body={row => row.component.measure.multi_dimension ? row.width.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : <div className="text-gray-300">{"n/a"}</div>} ></Column>
                                        <Column /* header="Quantidade" */ body={row => row.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ></Column>
                                        <Column /* header="Custo" */ body={row => formatToBRCurrency(row.cost, 2, 2)} ></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </TabPanel >
                    }
                    {!isNewRecord &&
                        <TabPanel
                            header="Foto"
                            leftIcon="fa-regular fa-image mr-1"
                            disabled={isNewRecord}
                        >

                        </TabPanel>
                    }
                </TabView >
            </div >
        </>
    );
};