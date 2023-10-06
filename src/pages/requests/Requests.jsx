import React, { useState, useEffect, useRef } from "react";
import { Card } from 'primereact/card';
import { useMatch } from "react-location";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import "./Requests.css";

export default function Requests() {

    const allowedTypes = ["PRODUCT_COMPONENT", "GIFT"];
    const allowedMeasures = ["UNITY", "MT", "CM", "MT2", "CM2"];

    const initialData = useMatch().data.requests;

    const toastRef = useRef(null);
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
                    <Tag className="mt-1" value={`${product.amount} x ${product.product.name}`} />
                ))}
            </div>;
    };

    return (
        <>
            <div className="content">
                <Card title="Pedidos" className="my-3">
                <div>
                    <Button label="Novo Pedido" severity="success" icon="pi pi-plus" />
                    <Button label="Abrir" icon="pi pi-eye" className="ml-1" />
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