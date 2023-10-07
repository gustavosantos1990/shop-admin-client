import React, { useState, useEffect, useRef } from "react";
import { Card } from 'primereact/card';
import { useMatch, useNavigate } from "react-location";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import "./Requests.css";
import { createWhatsAppLink } from "../../components/Utils";

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
        console.log(initialData[0]);
        setRequests(initialData[0].content)
        console.log(requests);
    }, []);

    useEffect(() => {
        console.log(selected)
    }, [selected]);

    const itemsColumn = (rowData) => {
        return <div className="flex flex-column align-items-start">
            {rowData.products && rowData.products.map(product => (
                <Tag className="mt-1" key={product.product.id} value={`${product.amount} x ${product.product.name}`} />
            ))}
        </div>;
    };

    const openWhatsApp = e => {
        const url = createWhatsAppLink(selected.customer.phone);
        window.open(url);
    };

    const printRequest = e => {
        console.error("not implemented");
    }

    return (
        <>
            <div className="content">
                <Card title="Pedidos" className="my-3">
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
                            icon="pi pi-print"
                            className="ml-1"
                            disabled={selected === null}
                            onClick={printRequest}
                        />
                        <Button
                            className="p-button-success ml-1"
                            icon="pi pi-whatsapp"
                            onClick={openWhatsApp}
                            disabled={selected === null}
                        />
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
                        onSelectionChange={(e) => { console.log(e); setSelected(e.value) }}
                    >
                        <Column header="ID" field="id" ></Column>
                        <Column header="Data do pedido" field="created_at" ></Column>
                        <Column header="Cliente" field="customer.name" ></Column>
                        <Column header="Telefone" field="customer.phone" ></Column>
                        <Column header="Data de entrega" field="due_date" ></Column>
                        <Column header="Items" body={itemsColumn} ></Column>
                        <Column header="Finalizado?" field="done" ></Column>
                    </DataTable>
                </div>
            </div>
        </>
    );
}