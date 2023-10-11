import React, { useState, useEffect, useRef } from "react";
import { Card } from 'primereact/card';
import { useMatch, useNavigate } from "react-location";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from "primereact/toast";
import "./Requests.css";
import { createWhatsAppLink, formatToBRDateTime, formatToBRDate } from "../../components/Utils";
import { getRequests } from "../../services/RequestService";

export default function Requests() {

    const allowedTypes = ["PRODUCT_COMPONENT", "GIFT"];
    const allowedMeasures = ["UNITY", "MT", "CM", "MT2", "CM2"];

    const initialData = useMatch().data.requests;
    const toastRef = useRef(null);
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        console.log("Starting Requests");
        setRequests(initialData)
    }, []);

    useEffect(() => {
        console.log(selected)
    }, [selected]);

    const itemsColumn = (rowData) => {
        return <div className="flex flex-column align-items-start">
            {rowData.request_products && rowData.request_products.map(product => (
                <Tag className="mt-1" key={product.product.id} value={`${product.amount} x ${product.product.name}`} />
            ))}
        </div>;
    };

    const openWhatsApp = e => {
        const url = createWhatsAppLink(selected.customer.phone);
        window.open(url);
    };

    const printRequest = e => {
        toastRef.current.show({ severity: 'info', summary: 'Aviso!', detail: "Funcionalidade ainda não implementada", life: 3000 });
    };

    const finishRequest = e => {
        toastRef.current.show({ severity: 'info', summary: 'Aviso!', detail: "Funcionalidade ainda não implementada", life: 3000 });
    };

    const sendToForm = e => {
        navigate({ to: e.data.id, replace: true })
    };

    const fetchRequests = () => {
        getRequests()
            .then(res => res.json())
            .then(res => {
                setRequests(res);
                toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: "Listagem atualizada!", life: 3000 });
            });
    }

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
            <Toast ref={toastRef} />
            <div className="content">
                <Card title="Pedidos" className="my-3">
                    <div>
                        <Button raised
                            label="Novo Pedido"
                            severity="info" icon="pi pi-plus"
                            onClick={() => navigate({ to: "novo", replace: true })}
                        />
                        <Button raised
                            tooltip="Editar"
                            tooltipOptions={{ position: "top" }}
                            icon="pi pi-pencil"
                            className="ml-1"
                            disabled={selected === null}
                            onClick={() => navigate({ to: selected.id, replace: true })}
                        />
                        <Button raised
                            icon="pi pi-print"
                            className="ml-1"
                            tooltip="Imprimir Detalhes"
                            tooltipOptions={{ position: "top" }}
                            disabled={selected === null}
                            onClick={printRequest}
                        />
                        <Button raised
                            className="p-button-success ml-1"
                            icon="pi pi-whatsapp"
                            onClick={openWhatsApp}
                            tooltip="Abrir WhatsApp"
                            tooltipOptions={{ position: "top" }}
                            disabled={selected === null}
                        />
                        <Button raised
                            icon="pi pi-trash"
                            className="ml-1"
                            disabled={selected === null}
                            severity="warning"
                            tooltip="Deletar"
                            tooltipOptions={{ position: "top" }}
                            onClick={() => showDeleteConfirmationDialog()}
                        />
                        <Button raised
                            className="ml-1"
                            icon="pi pi-refresh"
                            tooltip="Atualizar Lista"
                            tooltipOptions={{ position: "top" }}
                            onClick={() => fetchRequests()} />
                                                    <Button raised
                            className="ml-1"
                            icon="pi pi-check-circle"
                            tooltip="Finalizar Pedido"
                            tooltipOptions={{ position: "top" }}
                            onClick={() => finishRequest()} />
                    </div>
                </Card>
                <div className="scrollable">
                    <DataTable
                        value={requests}
                        scrollable
                        showGridlines
                        rowHover
                        dataKey="id"
                        selectionMode="single"
                        selection={selected}
                        onSelectionChange={(e) => setSelected(e.value)}
                        onRowDoubleClick={sendToForm}
                    >
                        <Column header="ID" field="id" ></Column>
                        <Column header="Data da Entrega" body={row => formatToBRDate(row.due_date)} ></Column>
                        <Column header="Cadastrado em" body={row => formatToBRDateTime(row.created_at)} ></Column>
                        <Column header="Cliente" field="customer.name" ></Column>
                        <Column header="Telefone" field="customer.phone" ></Column>
                        <Column header="Items" body={itemsColumn} ></Column>
                        <Column header="Finalizado?" body={row => row.done ? "Sim" : "Não"} ></Column>
                    </DataTable>
                </div>
            </div>
        </>
    );
}