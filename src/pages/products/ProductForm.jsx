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
import { saveNewProduct, updateProduct } from "../../services/ProductService";
import { getComponents } from "../../services/ComponentService";
import { formatToBRDateTime, formatToBRCurrency } from "../../components/Utils";
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import "./ProductForm.css";

export default function ProductForm() {

    const routeDate = useMatch();
    const navigate = useNavigate();
    const toastRef = useRef(null);
    const contextMenuRef = useRef(null);
    const [isNewRecord, setIsNewRecord] = useState(routeDate.params.id === "novo" || routeDate.params.id === "undefined" || routeDate.params.id === "null");
    const [product, setProduct] = useState(routeDate.data.product);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [selectedDialogComponent, setSelectedDialogComponent] = useState(null);
    const [components, setComponents] = useState(null);
    const [visible, setVisible] = useState(false);
    const [filters, setFilters] = useState({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const { control, formState: { errors }, handleSubmit, reset } = useForm(
        {
            defaultValues: productSchema.cast(),
            mode: "onBlur",
            resolver: yupResolver(productSchema)
        }
    );

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

    const fetchComponents = () => {
        getComponents()
            .then(res => res.json())
            .then(json => setComponents(json));
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

    const getFormErrorMessage = path => {
        var value = path.split('.').reduce((o, p) => o && o[p], errors);
        return value && <small className="p-error">{value.message}</small>;
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
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
                                    <p className="text-2xl">{formatToBRCurrency(product.components?.map(c => c.cost).reduce((prev, val) => prev + val, 0.00), 2, 2)}</p>
                                    <Menu model={[
                                        { label: 'Novo', icon: 'pi pi-fw pi-plus', command: () => setVisible(true) },
                                        { label: `Excluir`, icon: 'pi pi-fw pi-trash', disabled: !selectedComponent },
                                        { label: 'Editar', icon: 'pi pi-fw pi-pencil', disabled: !selectedComponent }
                                    ]} />
                                </div>
                                <div className="scrollable">
                                    <ContextMenu model={[
                                        { label: 'Editar', icon: 'pi pi-fw pi-pencil' },
                                        { label: 'Excluir', icon: 'pi pi-fw pi-trash' },
                                        { label: 'Limpar seleção', icon: 'pi pi-fw pi-ban', command: () => setSelectedComponent(null) }
                                    ]} ref={contextMenuRef} breakpoint="767px" />
                                    <Dialog
                                        header="Componentes"
                                        visible={visible}
                                        style={{ width: '60vw' }}
                                        onHide={() => setVisible(false)}
                                        footer={<div>
                                            <Button
                                                label="Cancelar"
                                                icon="pi pi-ban"
                                                severity="danger"
                                                type="button"
                                                onClick={() => setVisible(false)} />
                                            <Button
                                                label="Salvar"
                                                severity="success"
                                                icon="pi pi-save"
                                                onClick={() => setVisible(false)}
                                                disabled={selectedDialogComponent === null || selectedDialogComponent === undefined}
                                                autoFocus />
                                        </div>}
                                        position="top-right"
                                        draggable={false}
                                        closable={false}
                                    >
                                        <div>
                                            <DataTable
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
                                        </div>
                                        {selectedDialogComponent && <h3>Quantidade</h3>}
                                        {selectedDialogComponent ? selectedDialogComponent?.measure.multi_dimension === true ?
                                            <>
                                                <div className="p-fluid grid">
                                                    <div className="field col-3">
                                                        <label htmlFor="height">Altura</label>
                                                        <InputText id="height" />
                                                    </div>
                                                    <div className="field col-3">
                                                        <label htmlFor="width">Largura</label>
                                                        <InputText id="width" />
                                                    </div>
                                                    <div className="field col-3">
                                                        <label htmlFor="height">Quantidade</label>
                                                        <InputText id="height" readOnly disabled />
                                                    </div>
                                                </div>
                                            </>
                                            : <div className="p-fluid grid">
                                                <div className="field col-3">
                                                    <label htmlFor="height">Quantidade</label>
                                                    <InputText id="height" />
                                                </div>
                                            </div>
                                            : <></>
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
                </TabView >
            </div >
        </>
    );
};