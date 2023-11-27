import React, { useState, useRef, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import { useMatch, useNavigate } from "react-location";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { OverlayPanel } from "primereact/overlaypanel";
import { Checkbox } from "primereact/checkbox";
import "./Requests.css";
import { createWhatsAppLink, formatToBRDateTime, formatToBRDate, formatToBRCurrency, applyPhoneMask } from "../../components/Utils";
import { getRequests, updateRequestStatus } from "../../services/RequestService";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export default function Requests() {

    const initialData = useMatch().data.requests;
    const toastRef = useRef(null);
    const overlayPanelRef = useRef(null);
    const navigate = useNavigate();
    const [rawRequests, setRawRequests] = useState(initialData);
    const [requests, setRequests] = useState([]);
    const [selected, setSelected] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showCanceled, setShowCanceled] = useState(false);

    useEffect(() => {
        var filteredRequests = rawRequests.filter(r => showCanceled || r.status.value !== "CANCELED");
        setRequests(filteredRequests);
    }, [rawRequests, showCanceled]);

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

    const openFacebook = e => {
        const url = `https://m.me/${selected.customer.facebook_chat_number}`;//6466609060116754
        window.open(url);
    };

    const printRequest = e => {
        toastRef.current.show({ severity: 'info', summary: 'Aviso!', detail: "Funcionalidade ainda não implementada", life: 3000 });
    };

    const finishRequest = e => {
        toastRef.current.show({ severity: 'info', summary: 'Aviso!', detail: "Funcionalidade ainda não implementada", life: 3000 });
    };

    const cancelRequest = e => {
        toastRef.current.show({ severity: 'info', summary: 'Aviso!', detail: "Funcionalidade ainda não implementada", life: 3000 });
    };

    const sendToMovimentations = e => {
        toastRef.current.show({ severity: 'info', summary: 'Aviso!', detail: "Funcionalidade ainda não implementada", life: 3000 });
    };

    const sendToForm = e => {
        navigate({ to: e.data.id, replace: true })
    };

    const periodForSelectedMonth = date => {
        var start = new Date(date);
        start.setDate(1);
        var end = new Date(date);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        return {
            start: start,
            end: end
        };
    };

    const fetchRequests = date => {
        const period = periodForSelectedMonth(date);
        console.log(period.start.toISOString().split('T')[0]);
        console.log(period.end.toISOString().split('T')[0]);
        getRequests(period.start, period.end)
            .then(async res => {
                var json = await res.json();
                if (!res.ok) {
                    toastRef.current.show({ severity: 'error', summary: 'Erro!', detail: json.message });
                    return;
                }
                setRawRequests(json);
                toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: "Listagem atualizada!", life: 500 });
            });
    };

    const updateToDoingSelectedRequest = () => {
        updateRequestStatus(selected.id, "DOING")
            .then(async res => {
                var json = await res.json();
                if (!res.ok) {
                    toastRef.current.show({ severity: 'error', summary: 'Erro!', detail: json.message });
                    return;
                }
                fetchRequests(date);
                toastRef.current.show({
                    severity: 'success', summary: 'Successo!',
                    detail: "Status do pedido atualizado com sucesso.", life: 3000
                });
            });
    };

    const cancelSelectedRequest = () => {
        updateRequestStatus(selected.id, "CANCELED")
            .then(async res => {
                var json = await res.json();
                if (!res.ok) {
                    toastRef.current.show({ severity: 'error', summary: 'Erro!', detail: json.message });
                    return;
                }
                fetchRequests(date);
                toastRef.current.show({ severity: 'success', summary: 'Successo!', detail: "Pedido cancelado com sucesso.", life: 3000 });
            });
    };

    const showDeleteConfirmationDialog = () => {
        toastRef.current.show({ severity: 'info', summary: 'Aviso!', detail: "Funcionalidade ainda não implementada", life: 3000 });
    };

    const showDoingConfirmationDialog = () => {
        confirmDialog({
            message: 'Deseja realmente colocar pedido EM PRODUÇÃO?',
            header: 'Confirmar',
            icon: 'pi pi-info-circle',
            acceptLabel: "Sim",
            rejectLabel: "Não",
            accept: updateToDoingSelectedRequest,
            reject: () => { }
        });
    };

    const showCancelConfirmationDialog = () => {
        confirmDialog({
            message: 'Deseja realmente CANCELAR este pedido?',
            header: 'Confirmar',
            icon: 'pi pi-info-circle',
            acceptLabel: "Sim",
            rejectLabel: "Não",
            accept: cancelSelectedRequest,
            reject: () => { }
        });
    };

    const tableHeader = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div>
                <span className="text-xl text-900 font-bold">PEDIDOS</span>
            </div>
            <div className="">
                <Calendar
                    value={date}
                    view="month"
                    dateFormat="mm/yy"
                    inputStyle={{ textAlign: 'center' }}
                    onChange={(e) => {
                        setSelected(null);
                        setDate(e.value);
                        fetchRequests(e.value);
                    }}
                    showButtonBar
                    clearButtonClassName="hidden"
                />
                <Button
                    className="m-1"
                    icon="pi pi-filter"
                    onClick={(e) => overlayPanelRef.current.toggle(e)}
                    rounded
                    raised
                    size="small" />
                <OverlayPanel ref={overlayPanelRef}>
                    <div className="">
                        <div className="field-checkbox">
                            <Checkbox inputId="checkCanceled" onChange={e => setShowCanceled(e.checked)} checked={showCanceled} />
                            <label htmlFor="checkCanceled">Exibir cancelados?</label>
                        </div>
                    </div>
                </OverlayPanel>
                <Button
                    className="m-1"
                    icon="pi pi-refresh"
                    tooltip="Atualizar Lista"
                    tooltipOptions={{ position: "top" }}
                    onClick={() => fetchRequests(date)}
                    rounded
                    raised
                    size="small"
                />
            </div>
        </div>
    );

    return (
        <>
            <Toast ref={toastRef} />
            <ConfirmDialog />
            <div className="content mx-8">
                <div className="scrollable">
                    <div className="flex">
                        <div className="flex-none mr-2">
                            <div className="flex flex-column">
                                <Button
                                    raised
                                    label="Novo Pedido"
                                    className="m-1"
                                    severity="info" icon="pi pi-plus"
                                    onClick={() => navigate({ to: "novo", replace: true })}
                                    size="small"
                                />
                                <Button
                                    raised
                                    label="Editar"
                                    icon="pi pi-pencil"
                                    className="m-1"
                                    disabled={selected === null}
                                    onClick={() => navigate({ to: selected.id, replace: true })}
                                    size="small"
                                />
                                <Button
                                    raised
                                    icon="pi pi-print"
                                    className="m-1"
                                    label="Imprimir Detalhes"
                                    disabled={selected === null}
                                    onClick={printRequest}
                                    size="small"
                                />
                                <Button
                                    raised
                                    className="p-button-success m-1"
                                    icon="pi pi-whatsapp"
                                    onClick={openWhatsApp}
                                    label="Abrir WhatsApp"
                                    disabled={selected === null}
                                    size="small"
                                />
                                <Button
                                    raised
                                    className="p-button-info m-1"
                                    icon="pi pi-facebook"
                                    onClick={openFacebook}
                                    label="Abrir chat do Facebook"
                                    disabled={selected === null || !selected.customer?.facebook_chat_number}
                                    size="small"
                                />
                                <Button
                                    raised
                                    icon="pi pi-trash"
                                    className="m-1"
                                    disabled={selected === null}
                                    severity="danger"
                                    label="Deletar"
                                    onClick={() => showDeleteConfirmationDialog()}
                                    size="small"
                                />
                                <Button
                                    raised
                                    icon="pi pi-palette"
                                    className="m-1"
                                    disabled={selected === null}
                                    label="Seguir para produção"
                                    onClick={() => showDoingConfirmationDialog()}
                                    size="small"
                                />
                                <Button
                                    raised
                                    icon="pi pi-ban"
                                    className="m-1"
                                    disabled={selected === null}
                                    severity="warning"
                                    label="Cancelar"
                                    onClick={() => showCancelConfirmationDialog()}
                                    size="small"
                                />
                                <Button
                                    raised
                                    className="p-button-success m-1"
                                    icon="pi pi-money-bill"
                                    label="Movimentações"
                                    disabled={selected === null}
                                    onClick={() => sendToMovimentations()}
                                    size="small"
                                />
                                <Button
                                    raised
                                    className="m-1"
                                    icon="pi pi-check-circle"
                                    label="Finalizar Pedido"
                                    disabled={selected === null}
                                    onClick={() => finishRequest()}
                                    size="small"
                                />
                            </div>
                        </div>
                        <div className="flex-grow-1">
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
                                header={tableHeader}
                                emptyMessage="Sem resultados para o mês selecionado..."
                            >
                                <Column header="Data da Entrega" body={row => formatToBRDate(row.due_date)} ></Column>
                                <Column header="Cadastrado em" body={row => formatToBRDateTime(row.created_at)} ></Column>
                                <Column header="Status" body={row => <Tag severity={row.status.severity} value={row.status.label} />}></Column>
                                <Column header="Cliente" field="customer.name" ></Column>
                                <Column header="Telefone" body={row => applyPhoneMask(row.customer.phone)} ></Column>
                                <Column header="Items" body={itemsColumn} ></Column>
                                <Column header="Total" body={row => formatToBRCurrency(row.request_products.reduce((prevVal, rp) => prevVal + (rp.unitary_value * rp.amount), 0))} ></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}