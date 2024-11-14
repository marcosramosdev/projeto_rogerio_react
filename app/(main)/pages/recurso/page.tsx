/* eslint-disable @next/next/no-img-element */
'use client';
import { RecursoService } from '@/service/RecursoService';
import { Projeto } from '@/types';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const Crud = () => {
    let recursoVazio: Projeto.Recurso = {
        id: 0,
        nome: '',
        chave: ''
    };

    const [recursos, setRecursos] = useState<Projeto.Recurso[]>([]);
    const [recursoDialog, setRecursoDialog] = useState(false);
    const [deleteRecursoDialog, setDeleteRecursoDialog] = useState(false);
    const [deleteRecursosDialog, setDeleteRecursosDialog] = useState(false);
    const [recurso, setRecurso] = useState<Projeto.Recurso>(recursoVazio);
    const [selectedRecursos, setSelectedRecursos] = useState<Projeto.Recurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const recursoService = useMemo(() => new RecursoService(), []);
    useEffect(() => {
        if (recursos.length === 0) {
            recursoService
                .listarTodos()
                .then((response) => setRecursos(response.data))
                .catch((error) => console.log(error));
        }
    }, [recursos, recursoService]);

    const openNew = () => {
        setRecurso(recursoVazio);
        setSubmitted(false);
        setRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRecursoDialog(false);
    };

    const hideDeleteRecursoDialog = () => {
        setDeleteRecursoDialog(false);
    };

    const hideDeleteRecursosDialog = () => {
        setDeleteRecursosDialog(false);
    };

    const saveRecurso = () => {
        if (!recurso.id) {
            //cadastrar
            recursoService
                .inserir(recurso)
                .then((response) => {
                    setRecursoDialog(false);
                    setRecurso(recursoVazio);
                    setRecursos([]);
                    toast?.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Resorce succesfuly created'
                    });
                })
                .catch((err) => {
                    toast?.current?.show({
                        severity: 'info',
                        summary: 'error!',
                        detail: 'Unexpected error creating resorce'
                    });
                    console.log(err);
                });
        }
        if (recurso.id) {
            //alterar
            recursoService
                .alterar(recurso)
                .then((response) => {
                    setRecursoDialog(false);
                    setRecurso(recursoVazio);
                    setRecursos([]);
                    toast?.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Resource succesfuly updated'
                    });
                })
                .catch((err) => {
                    toast?.current?.show({
                        severity: 'info',
                        summary: 'error!',
                        detail: 'Unexpected error updating resorce'
                    });
                    console.log(err);
                });
        }
    };

    const editRecurso = (recurso: Projeto.Recurso) => {
        setRecurso({ ...recurso });
        setRecursoDialog(true);
    };

    const confirmDeleteRecurso = (recurso: Projeto.Recurso) => {
        setRecurso(recurso);
        setDeleteRecursoDialog(true);
    };

    const deleteRecurso = () => {
        recursoService
            .deletar(recurso.id)
            .then((response) => {
                setDeleteRecursoDialog(false);
                setRecurso(recursoVazio);
                setRecursos(recursos.filter((val) => val.id !== recurso.id));
                toast?.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Resource succesfuly deleted'
                });
            })
            .catch((err) => {
                toast?.current?.show({
                    severity: 'info',
                    summary: 'error!',
                    detail: 'Unexpected error deleting resorce'
                });
                console.log(err);
            });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteRecursosDialog(true);
    };

    const deleteSelectedRecursos = () => {
        Promise.all(
            selectedRecursos.map(async (recurso) => {
                if (recurso.id) {
                    return await recursoService.deletar(recurso.id);
                }
            })
        )
            .then(() => {
                setSelectedRecursos([]);
                setRecursos([]);
                setDeleteRecursosDialog(false);
                toast?.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Resources succesfuly deleted'
                });
            })
            .catch(() => {
                toast?.current?.show({
                    severity: 'error',
                    summary: 'error!',
                    detail: 'Unexpected error deleting Resources'
                });
            });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = e.target && e.target.value;
        // let _recurso = { ...recurso };
        // _recurso[`${name}`] = val;
        // setRecurso(_recurso);

        setRecurso((prevRecurso: Projeto.Recurso) => ({
            ...prevRecurso,
            [name]: val
        }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRecursos || !(selectedRecursos as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.Recurso) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Projeto.Recurso) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.nome}
            </>
        );
    };

    const chaveBodyTemplate = (rowData: Projeto.Recurso) => {
        return (
            <>
                <span className="p-column-title">Key</span>
                {rowData.chave}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.Recurso) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editRecurso(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteRecurso(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Resourses</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const recursoDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveRecurso} />
        </>
    );
    const deleteRecursoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteRecursoDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteRecurso} />
        </>
    );
    const deleteRecursosDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedRecursos} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={recursos}
                        selection={selectedRecursos}
                        onSelectionChange={(e) => setSelectedRecursos(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} resorce"
                        globalFilter={globalFilter}
                        emptyMessage="No resorce found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Code" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Name" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="chave" header="Key" sortable body={chaveBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column field="action" header="Actions" sortable body={actionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={recursoDialog} style={{ width: '450px' }} header="Resource Details" modal className="p-fluid" footer={recursoDialogFooter} onHide={hideDialog} draggable>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={recurso.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !recurso.name
                                })}
                            />
                            {submitted && !recurso.name && <small className="p-invalid">Name is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="key">Key</label>
                            <InputText
                                id="chave"
                                value={recurso.chave}
                                onChange={(e) => onInputChange(e, 'chave')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !recurso.name
                                })}
                            />
                            {submitted && !recurso.chave && <small className="p-invalid">Key is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRecursoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRecursoDialogFooter} onHide={hideDeleteRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {recurso && (
                                <span>
                                    Are you sure you want to delete <b>{recurso.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRecursosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRecursosDialogFooter} onHide={hideDeleteRecursosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {recursos && <span>Are you sure you want to delete the selected resourses?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
