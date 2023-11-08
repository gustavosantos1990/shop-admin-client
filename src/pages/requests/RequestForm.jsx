import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useMatch } from 'react-location';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Calendar } from "primereact/calendar";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from "primereact/toast";
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Steps } from 'primereact/steps';
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { ContextMenu } from 'primereact/contextmenu';
import { Menu } from 'primereact/menu';
import { TabView, TabPanel } from 'primereact/tabview';
import { classNames } from 'primereact/utils';
import customerSchema from "../../schemas/CustomerSchema";
import requestSchema from "../../schemas/RequestSchema";
import requestProductSchema from "../../schemas/RequestProductSchema";
import { getProducts } from "../../services/ProductService";
import { getRequestByID, updateRequest } from "../../services/RequestService";
import { deleteRequestProduct, saveNewRequestProduct, updateRequestProduct } from "../../services/RequestProductService";
import { formatToBRCurrency, convertDate } from "../../components/Utils";
import "./RequestForm.css";
import { Divider } from "primereact/divider";

export default function RequestForm() {

    const routeDate = useMatch();
    const navigate = useNavigate();
    const toastRef = useRef(null);
    const contextMenuRef = useRef(null);
    const [request, setRequest] = useState(routeDate.data.request);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedDialogProduct, setSelectedDialogProduct] = useState(null);
    const [openForUpdate, setOpenForUpdate] = useState(false);
    const [products, setProducts] = useState(null);
    const [visible, setVisible] = useState(false);
    const [filters, setFilters] = useState({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const {
        control: customerControl,
        formState: { errors: customerErrors },
        handleSubmit: handleCustomerSubmit,
        watch: customerWatcher,
        reset: resetCustomer } = useForm({
            defaultValues: request.customer,
            mode: "onBlur",
            resolver: yupResolver(customerSchema)
        });

    const {
        control: requestControl,
        formState: { errors: requestErrors },
        handleSubmit: handleRequestSubmit,
        watch: requestWatcher,
        reset: resetRequest } = useForm({
            defaultValues: request,
            mode: "onBlur",
            resolver: yupResolver(requestSchema)
        });

    const {
        control: productControl,
        formState: { errors: productErrors },
        handleSubmit: handleProductSubmit,
        watch: productWatcher,
        reset: resetProduct } = useForm({
            defaultValues: requestProductSchema.cast(),
            mode: "onBlur",
            resolver: yupResolver(requestProductSchema)
        });

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedDialogProduct != null && selectedDialogProduct !== undefined) {
            resetProduct(openForUpdate ? selectedProduct : Object.assign(requestProductSchema.cast(), {
                product: selectedDialogProduct,
                unitary_value: selectedDialogProduct.price,
                declared_production_cost: selectedDialogProduct.components.map(c => c.cost).reduce((prev, val) => prev + val, 0.00)
            }));
        }
    }, [selectedDialogProduct]);

    const fetchProducts = () => {
        getProducts()
            .then(res => res.json())
            .then(json => setProducts(json));
    }

    const fetchRequest = () => {
        getRequestByID(request.id)
            .then(res => res.json())
            .then(json => setRequest(json));
    };

    const deleteSelectedRequestProduct = () => {
        deleteRequestProduct(request.id, selectedProduct.product.id)
            .then(res => {
                if (res.ok) {
                    setSelectedProduct(null);
                    fetchRequest();
                    toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: "Product deletado com sucesso.", life: 3000 });
                }
            })
    };

    const onCustomerSubmit = data => {
        updateRequest(data).then(async res => {
            var json = await res.json();
            if (res.ok) {
                toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: "Pedido atualizado com sucesso.", life: 3000 });
                navigate({ to: `/pedidos/${json.id}`, replace: true, fromCurrent: true });
                setRequest(json);
            } else {
                toastRef.current.show({ severity: 'error', summary: 'Erro!', detail: json.message });
            }
        });
    };

    const onRequestSubmit = data => {
        updateRequest(data).then(async res => {
            var json = await res.json();
            if (res.ok) {
                toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: "Pedido atualizado com sucesso.", life: 3000 });
                navigate({ to: `/pedidos/${json.id}`, replace: true, fromCurrent: true });
                setRequest(json);
            } else {
                toastRef.current.show({ severity: 'error', summary: 'Erro!', detail: json.message });
            }
        });
    };

    const onProductSubmit = data => {
        console.log(data);
        const existingProduct = !request.request_products || request.request_products.length === 0 ? null : request.request_products.find(pc => pc.product.id === data.product.id);
        const isNewRequestProduct = existingProduct === null || existingProduct === undefined;
        const promisse = isNewRequestProduct
            ? saveNewRequestProduct(request.id, data)
            : updateRequestProduct(request.id, data.product.id, data);
        const successMessage = isNewRequestProduct ? "Product incluído com sucesso." : "Pedido atualizado com sucesso."

        promisse.then(async res => {
            var json = await res.json();
            if (res.ok) {
                toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: successMessage, life: 3000 });
                setSelectedProduct(false);
                setVisible(false);
                fetchRequest();
            } else {
                toastRef.current.show({ severity: 'error', summary: 'Erro!', detail: json.message });
            }
        });
    };

    const getCustomerFormErrorMessage = path => {
        var value = path.split('.').reduce((o, p) => o && o[p], customerErrors);
        return value && <small className="p-error">{value.message}</small>;
    };

    const getRequestFormErrorMessage = path => {
        var value = path.split('.').reduce((o, p) => o && o[p], requestErrors);
        return value && <small className="p-error">{value.message}</small>;
    };


    const getProductFormErrorMessage = path => {
        var value = path.split('.').reduce((o, p) => o && o[p], productErrors);
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

    const openProductsDialog = () => {
        setOpenForUpdate(false);
        setSelectedDialogProduct(null);
        resetProduct(requestProductSchema.cast());
        setVisible(true);
        clearFilter();
    };

    const openProductsDialogForUpdate = () => {
        setOpenForUpdate(true);
        setSelectedDialogProduct(selectedProduct.product);
        setVisible(true);
    };

    const openProductsDialogForUpdateGivenRequestProduct = requestProduct => {
        setOpenForUpdate(true);
        setSelectedProduct(requestProduct);
        setSelectedDialogProduct(requestProduct.product);
        setVisible(true);
    };

    /****************CALCULATIONS******************/

    const priceTotalCalc = product => {
        return product.unitary_value * product.amount
    }

    const costTotalCalc = product => {
        return product.declared_production_cost * product.amount;
    };

    const rawProfitCalc = row => {
        return priceTotalCalc(row) - costTotalCalc(row);
    };

    const rawProfitMarginCalc = row => {
        var rawProfit = rawProfitCalc(row);
        var priceTotal = priceTotalCalc(row);
        var margin = (rawProfit / priceTotal) * 100;
        return margin.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
    };

    /**********************************************/

    const priceTotalColumn = row => {
        return formatToBRCurrency(priceTotalCalc(row), 2, 2)
    }

    const costTotalColumn = row => {
        return formatToBRCurrency(costTotalCalc(row), 2, 2)
    }

    const rawProfitColumn = row => {
        return formatToBRCurrency(rawProfitCalc(row), 2, 2);
    };

    const rawProfitMarginColumn = row => {
        return `${rawProfitMarginCalc(row)}%`;
    };

    return (
        <>
            <div className="content mx-8">
                <Toast ref={toastRef} />
                <div className="flex justify-content-between align-content-end">
                    <h2>Cadastro de Pedidos</h2>
                    <div className="flex align-content-center flex-wrap">
                        <Button
                            type="button"
                            icon="pi pi-arrow-left"
                            onClick={() => navigate({ to: `/pedidos`, replace: true })}
                        />
                    </div>
                </div>

                <TabView activeIndex={2}>
                    <TabPanel header="Cliente"
                        leftIcon="pi pi-user mr-2">
                        <form onSubmit={handleCustomerSubmit(onCustomerSubmit)}>
                            <div className="p-fluid grid">
                                <div className="field col-6 lg:col-4">
                                    <label htmlFor="phone" className={classNames({ 'p-error': customerErrors.customer && customerErrors.phone })}>Telefone*</label>
                                    <Controller
                                        name="phone"
                                        control={customerControl}
                                        render={({ field, fieldState }) =>
                                            <InputText
                                                id={field.name}
                                                {...field}
                                                keyfilter="int"
                                                value={field.value}
                                                onChange={e => field.onChange(e.target.value)}
                                                className={classNames({ 'p-invalid': fieldState.error })}
                                                maxLength={11}
                                            />
                                        } />
                                    {getCustomerFormErrorMessage('phone')}
                                </div>
                            </div>
                            <div className="p-fluid grid">
                                <div className="field col-10 md:col-4">
                                    <label htmlFor="name" className={classNames({ 'p-error': customerErrors.customer && customerErrors.name })}>Nome*</label>
                                    <Controller
                                        name="name"
                                        control={customerControl}
                                        render={({ field, fieldState }) => (
                                            <InputText id={field.name} {...field}
                                                value={field.value}
                                                onChange={e => field.onChange(e.target.value)}
                                                className={classNames({ 'p-invalid': fieldState.error })} />
                                        )} />
                                    {getCustomerFormErrorMessage('name')}
                                </div>
                            </div>
                            <div className="p-fluid grid">
                                <div className="field col-10 md:col-4">
                                    <label htmlFor="facebook_chat_number" >Número do chat no Facebook/Messenger</label>
                                    <Controller
                                        name="facebook_chat_number"
                                        control={customerControl}
                                        render={({ field }) => (
                                            <div className="p-inputgroup">
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-facebook"></i>
                                                </span>
                                                <InputText
                                                    id={field.name}
                                                    {...field}
                                                    value={field.value}
                                                    onChange={e => field.onChange(e.target.value)}
                                                    required={false}
                                                />
                                            </div>
                                        )} />
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
                    <TabPanel header="Pedido"
                        leftIcon="pi pi-calendar mr-2">
                        <Steps
                            className="mt-3"
                            model={[
                                { label: "Cadastrado" },
                                { label: "Em Produção" },
                                { label: "Entregue" },
                                { label: "Processado" },
                                { label: "Finalizado" }
                            ]}
                            activeIndex={1}
                        />
                        <Divider />
                        <form onSubmit={handleRequestSubmit(onRequestSubmit)}>
                            <div className="card p-2">
                                <div className="p-fluid grid">
                                    <div className="field col-6 lg:col-2 md:col-3">
                                        <label htmlFor="due_date" className={classNames({ 'p-error': requestErrors.due_date })}>Data de Entrega*</label>
                                        <Controller
                                            name="due_date"
                                            control={requestControl}
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
                                        {getRequestFormErrorMessage('due_date')}
                                    </div>
                                </div>
                                <div className="p-fluid grid">
                                    <div className="field col-10 md:col-6">
                                        <label htmlFor="notes">Observações</label>
                                        <Controller
                                            name="notes"
                                            control={requestControl}
                                            render={({ field }) => (
                                                <InputTextarea
                                                    id={field.name}
                                                    {...field}
                                                    value={field.value}
                                                    onChange={e => field.onChange(e.target.value)}
                                                    required={false}
                                                />
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
                    <TabPanel header="Produtos"
                        leftIcon="pi pi-list mr-2"
                    >
                        <div className="flex flex-column">
                            <div className="mb-3 flex align-content-start flex-wrap">
                                <div className="">
                                    <Menu model={[
                                        { label: 'Novo', icon: 'pi pi-fw pi-plus', command: () => openProductsDialog() },
                                        { label: `Excluir`, icon: 'pi pi-fw pi-trash', disabled: !selectedProduct, command: () => deleteSelectedRequestProduct() },
                                        { label: 'Editar', icon: 'pi pi-fw pi-pencil', disabled: !selectedProduct, command: () => openProductsDialogForUpdate() }
                                    ]} />
                                </div>
                                <div className="ml-6">
                                    <h4>Total:</h4>
                                    <p className="text-2xl">{formatToBRCurrency(!request.request_products ? 0.00 : request.request_products.map(c => c.unitary_value * c.amount).reduce((prev, val) => prev + val, 0.00), 2, 2)}</p>
                                </div>

                            </div>
                            <div className="scrollable">
                                <ContextMenu model={[
                                    { label: 'Editar', icon: 'pi pi-fw pi-pencil', command: () => openProductsDialogForUpdate() },
                                    { label: 'Excluir', icon: 'pi pi-fw pi-trash', command: () => deleteSelectedRequestProduct() },
                                    { label: 'Limpar seleção', icon: 'pi pi-fw pi-ban', command: () => setSelectedProduct(null) }
                                ]} ref={contextMenuRef} breakpoint="767px" />
                                <Dialog
                                    header="Produto"
                                    visible={visible}
                                    style={{ width: '80vw', minHeight: '60vh' }}
                                    onHide={() => setVisible(false)}
                                    position="top-right"
                                    draggable={false}
                                >
                                    <div>
                                        {(!selectedDialogProduct || !openForUpdate)
                                            ? <DataTable
                                                value={products}
                                                size="small"
                                                dataKey="id"
                                                selectionMode="single"
                                                selection={selectedDialogProduct}
                                                onSelectionChange={(e) => setSelectedDialogProduct(e.value)}
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
                                                <Column header="Produto" field="name" style={{ width: '30%' }} ></Column>
                                                <Column header="Custo de Produção" body={row => formatToBRCurrency(row.components.map(c => c.cost).reduce((prev, val) => prev + val, 0.00), 2, 2)} ></Column>
                                                <Column header="Preço" body={row => formatToBRCurrency(row.price, 2, 2)} ></Column>
                                            </DataTable>
                                            : <Card title={selectedDialogProduct?.name} className="shadow-4 p-0" >
                                                {selectedDialogProduct && <div>
                                                    <p>Custo de Produção: {formatToBRCurrency(selectedDialogProduct.components.map(c => c.cost).reduce((prev, val) => prev + val, 0.00), 2, 2)}</p>
                                                    <p>Preço: {formatToBRCurrency(selectedDialogProduct.price)}</p>
                                                </div>}
                                            </Card>
                                        }
                                    </div>
                                    {selectedDialogProduct && <h3>Quantidade</h3>}
                                    {selectedDialogProduct
                                        ? <form onSubmit={handleProductSubmit(onProductSubmit)}>
                                            <div className="p-fluid grid">
                                                <div className="field col-3">
                                                    <label htmlFor="unitary_value" className={classNames({ 'p-error': productErrors.unitary_value })}>Valor*</label>
                                                    <Controller
                                                        name="unitary_value"
                                                        control={productControl}
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
                                                    {getProductFormErrorMessage('unitary_value')}
                                                </div>
                                                <div className="field col-3">
                                                    <label htmlFor="declared_production_cost" className={classNames({ 'p-error': productErrors.declared_production_cost })}>Custo de Produção*</label>
                                                    <Controller
                                                        name="declared_production_cost"
                                                        control={productControl}
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
                                                    {getProductFormErrorMessage('declared_production_cost')}
                                                </div>
                                                <div className="field col-3">
                                                    <label htmlFor="amount" className={classNames({ 'p-error': productErrors.amount })}>Quantidade*</label>
                                                    <Controller
                                                        name="amount"
                                                        control={productControl}
                                                        render={({ field, fieldState }) =>
                                                            <InputNumber id={field.name} {...field}
                                                                onChange={(e) => field.onChange(e.value)}
                                                                locale="pt-BR"
                                                                maxFractionDigits={2}
                                                                minFractionDigits={2}
                                                                className={classNames({ 'p-invalid': fieldState.error })} />
                                                        } />
                                                    {getProductFormErrorMessage('amount')}
                                                </div>
                                            </div>
                                            <div className="p-fluid grid">
                                                <div className="field col-3">
                                                    <label htmlFor="total">Total</label>
                                                    <InputNumber
                                                        id="total"
                                                        readOnly
                                                        locale="pt-BR"
                                                        maxFractionDigits={2}
                                                        minFractionDigits={2}
                                                        style={{ pointerEvents: 'none' }}
                                                        value={productWatcher('unitary_value') * productWatcher('amount')}
                                                    />
                                                </div>
                                                <div className="field col-3">
                                                    <label htmlFor="total_cost">Total Custo</label>
                                                    <InputNumber
                                                        id="total_cost"
                                                        readOnly
                                                        locale="pt-BR"
                                                        maxFractionDigits={2}
                                                        minFractionDigits={2}
                                                        style={{ pointerEvents: 'none' }}
                                                        value={productWatcher('declared_production_cost') * productWatcher('amount')}
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-fluid grid">
                                                <div className="field col-12">
                                                    <label htmlFor="notes">Observações</label>
                                                    <Controller
                                                        name="notes"
                                                        control={productControl}
                                                        render={({ field }) => (
                                                            <InputTextarea
                                                                id={field.name}
                                                                {...field}
                                                                value={field.value}
                                                                rows={1}
                                                                onChange={e => field.onChange(e.target.value)}
                                                                required={false}
                                                            />
                                                        )} />
                                                </div>
                                            </div>
                                            <div className="p-fluid grid">
                                                <div className="field col">
                                                    <label htmlFor="file_path">Pasta do arquivo do Produto</label>
                                                    <Controller
                                                        name="file_path"
                                                        control={productControl}
                                                        render={({ field }) => (
                                                            <div className="p-inputgroup">
                                                                <span className="p-inputgroup-addon">
                                                                    <i className="fa-regular fa-folder"></i>
                                                                </span>
                                                                <InputText id={field.name} {...field}
                                                                    value={field.value}
                                                                    onChange={e => field.onChange(e.target.value)}
                                                                    required={false}
                                                                />
                                                            </div>
                                                        )} />
                                                </div>
                                                <div className="field col">
                                                    <label htmlFor="file_link">Link do arquivo no Drive</label>
                                                    <Controller
                                                        name="file_link"
                                                        control={productControl}
                                                        render={({ field }) => (
                                                            <div className="p-inputgroup">
                                                                <span className="p-inputgroup-addon">
                                                                    <i className="fa-brands fa-google-drive"></i>
                                                                </span>
                                                                <InputText id={field.name} {...field}
                                                                    value={field.value}
                                                                    onChange={e => field.onChange(e.target.value)}
                                                                    required={false}
                                                                />
                                                            </div>
                                                        )} />
                                                </div>
                                            </div>
                                            <Button
                                                label="Salvar"
                                                severity="success"
                                                icon="pi pi-save"
                                                type="submit"
                                                disabled={selectedDialogProduct === null || selectedDialogProduct === undefined}
                                            />
                                            <Button
                                                className="ml-2"
                                                icon="pi pi-eye"
                                                type="button"
                                                visible={false}
                                                onClick={() => console.log(productErrors)}
                                            />
                                        </form>
                                        : <div className="mt-2 flex justify-content-center align-content-center flex-wrap" style={{ height: '20vh' }}>
                                            <div>
                                                <Message text="Selecione um produto" severity="warn" />
                                            </div>
                                        </div>
                                    }
                                </Dialog>
                                <DataTable
                                    value={request.request_products}
                                    size="small"
                                    scrollable
                                    showGridlines
                                    rowHover
                                    dataKey="product.id"
                                    selectionMode="single"
                                    selection={selectedProduct}
                                    onSelectionChange={(e) => setSelectedProduct(e.value)}
                                    emptyMessage="Sem resultados..."
                                    onContextMenu={(e) => { console.log(e); contextMenuRef.current.show(e.originalEvent) }}
                                    contextMenuSelection={selectedProduct}
                                    onContextMenuSelectionChange={(e) => setSelectedProduct(e.value)}
                                    onRowDoubleClick={evt => openProductsDialogForUpdateGivenRequestProduct(evt.data)}
                                >
                                    <Column header="Produto" field="product.name" style={{ width: '30%' }} ></Column>
                                    <Column header="Quantidade" body={row => row.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ></Column>
                                    <Column header="Custo Unitário" body={row => formatToBRCurrency(row.declared_production_cost, 2, 2)} style={{ color: 'red' }} ></Column>
                                    <Column header="Preço Unitário" body={row => formatToBRCurrency(row.unitary_value, 2, 2)} ></Column>
                                    <Column header="Custo Total" body={costTotalColumn} style={{ color: 'red' }} ></Column>
                                    <Column header="Preço Total" body={priceTotalColumn} ></Column>
                                    <Column header="Lucro Bruto" body={rawProfitColumn} ></Column>
                                    <Column header="Margem de Lucro Bruta" body={rawProfitMarginColumn} ></Column>
                                </DataTable>
                            </div>
                        </div>
                    </TabPanel >
                    <TabPanel header="Pagamentos"
                        leftIcon="fa-regular fa-money-bill-1 mr-1"
                    >

                    </TabPanel>
                    <TabPanel header="Despesas"
                        leftIcon="fa-solid fa-file-invoice-dollar mr-1"
                    >

                    </TabPanel>
                </TabView >
            </div >
        </>
    );
};