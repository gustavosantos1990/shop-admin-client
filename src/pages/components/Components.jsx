import React, { useState, useEffect, useRef } from "react";
import { useMatch } from "react-location";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function Components() {

    const allowedTypes = ["PRODUCT_COMPONENT", "GIFT"];
    const allowedMeasures = ["UNITY", "MT", "CM", "MT2", "CM2"];

    const toastRef = useRef(null);
    const [components, setComponents] = useState(useMatch().data.components);
    const [selected, setSelected] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        console.log("Starting Components");
    }, []);

    return (
        <>
            <h3>Componentes de Produtos</h3>
            <DataTable value={components}
                //responsiveLayout="scroll"
                //dataKey="material_id"
                rowHover
                //selection={selected}
                //selectionMode="single"
                showGridlines
            //header={headerTemplate}
            //onSelectionChange={e => setSelected(e.value)}
            //onRowDoubleClick={e => openFormDialogForUpdate(e.data)}
            //paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
            //filters={filters}
            //globalFilterFields={['name']}
            >
                <Column sortable field="customer.name" header="Cliente"></Column>
                <Column sortable field="customer.phone" header="Telefone"></Column>
                <Column sortable field="due_date" header="Data de entrega"></Column>
            </DataTable>
        </>
    );
}