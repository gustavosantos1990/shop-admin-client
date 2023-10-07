import React, { useState, useEffect } from "react";
import { Card } from 'primereact/card';
import { useMatch, useNavigate } from "react-location";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import "./Products.css";

export default function Products() {

    const initialData = useMatch().data.products;
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Starting Products");
        console.log(initialData);
        setProducts(initialData)
        console.log(products);
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

    const sendToForm = e => {
        console.log(e.data.id);
        navigate({ to: e.data.id, replace: true })
    }

    return (
        <>
            <div className="content">
                <Card title="Produtos" className="my-3">
                <div>
                    <Button label="Novo Pedido" severity="success" icon="pi pi-plus"
                        onClick={() => navigate({ to: "novo", replace: true })} />
                    <Button label="Abrir" icon="pi pi-eye" className="ml-1" />
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
                    >
                        <Column header="Nome" field="name" ></Column>
                        <Column header="Criado em" field="created_at" ></Column>
                        <Column header="Preço" field="price" ></Column>
                    </DataTable>
                </div>
            </div>
        </>
    );
}