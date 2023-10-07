import React, { useState, useEffect, useRef } from "react";
import { Card } from 'primereact/card';
import { useMatch, useNavigate } from "react-location";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { OverlayPanel } from 'primereact/overlaypanel';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode } from 'primereact/api';
import "./Products.css";
import { formatToBRDateTime, formatToBRCurrency } from "../../components/Utils";
import { deleteProduct, getProducts } from "../../services/ProductService";

export default function Products() {

    const initialData = useMatch().data.products;
    const navigate = useNavigate();
    const overlayPanelRef = useRef(null);
    const toastRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const includeDeletedOptions = [
        {
            label: "Incluir deletados",
            value: true
        },
        {
            label: "Ignorar deletados",
            value: false
        }
    ];
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        setProducts(initialData);
        setLoading(false);
    }, []);

    useEffect(() => {
    }, [selected]);

    const fetchProducts = async () => {
        getProducts(includeDeleted)
            .then(res => res.json())
            .then(res => setProducts(res));
    };

    const tableHeader = () => {
        return (
            <div className="flex justify-content-between">
                <div>
                    <div>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pesquisar" />
                        </span>
                    </div>

                </div>
                <div className="flex justify-content-start gap-1">
                    <Button icon="pi pi-filter" onClick={(e) => overlayPanelRef.current.toggle(e)} />
                    <OverlayPanel ref={overlayPanelRef}>
                        <div className="">
                            <div className="field-checkbox">
                                <Checkbox inputId="includeDeletedFilter" onChange={e => setIncludeDeleted(e.checked)} checked={includeDeleted} />
                                <label htmlFor="includeDeletedFilter">Exibir deletados?</label>
                            </div>
                            {/*
                            <div className="field-checkbox">
                                <Checkbox inputId="includeDeletedFilter" onChange={e => setIncludeDeleted(e.checked)} checked={includeDeleted} />
                                <label htmlFor="includeDeletedFilter" >Exibir deletados?</label>
                            </div>
                            */}
                        </div>
                    </OverlayPanel>
                    <Button icon="pi pi-refresh" onClick={() => fetchProducts()} />
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

    const sendToForm = e => {
        navigate({ to: e.data.id, replace: true })
    };

    const deleteSelectedProduct = () => {
        setLoading(true);
        deleteProduct(selected.id);
        fetchProducts();
        setLoading(false);
        toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: "Produto deletado!", life: 3000 });
    };

    const showDeleteConfirmationDialog = () => {
        confirmDialog({
            message: 'Deseja realmente deletar este produto?',
            header: 'Confirmar exclusão',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            acceptLabel: "Sim",
            rejectLabel: "Não",
            accept: deleteSelectedProduct,
            reject: () => { }
        });
    }

    return (
        <>
            <div className="content">
                <Toast ref={toastRef} />
                <ConfirmDialog />
                <Card title="PRODUTOS" className="my-3">
                    <div>
                        <Button
                            label="Novo Pedido"
                            severity="info" icon="pi pi-plus"
                            onClick={() => navigate({ to: "novo", replace: true })}
                        />
                        <Button
                            label="Editar"
                            icon="pi pi-pencil"
                            className="ml-1"
                            disabled={selected === null}
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
                    </div>
                </Card>
                <div className="scrollable">
                    <DataTable
                        value={products}
                        scrollable
                        showGridlines
                        rowHover
                        dataKey="id"
                        selectionMode="single"
                        selection={selected}
                        onSelectionChange={(e) => setSelected(e.value)}
                        onRowDoubleClick={sendToForm}
                        filters={filters}
                        header={tableHeader}
                        emptyMessage="Sem resultados..."
                        loading={loading}
                    >
                        <Column header="Nome" field="name" ></Column>
                        <Column header="Criado em" body={row => formatToBRDateTime(row.created_at)} ></Column>
                        <Column header="Preço" body={row => formatToBRCurrency(row.price, 2, 2)} ></Column>
                    </DataTable>
                </div>
            </div>
        </>
    );
}