/* eslint-disable @next/next/no-img-element */
'use client';
import { PerfilService } from '@/service/PerfilService';
import { UsuarioService } from '@/service/UsuarioService';
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

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let perfilVazio: Projeto.Pefil = {
        id: 0,
        descricao: ''
    };

    const [perfils, setPerfils] = useState<Projeto.Usuario[]>([]);
    const [perfilDialog, setPerfilDialog] = useState(false);
    const [deletePerfilDialog, setDeletePerfilDialog] = useState(false);
    const [deletePerfilsDialog, setDeletePerfilsDialog] = useState(false);
    const [perfil, setPerfil] = useState<Projeto.Perfil>(perfilVazio);
    const [selectedPerfils, setSelectedPerfils] = useState<Projeto.Perfil[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const perfilService = useMemo(() => new PerfilService(), []);

    useEffect(() => {
        if (perfils.length === 0) {
            perfilService
                .listarTodos()
                .then((response) => setPerfils(response.data))
                .catch((error) => console.log(error));
        }
    }, [perfils, perfilService]);

    const openNew = () => {
        setPerfil(perfilVazio);
        setSubmitted(false);
        setPerfilDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilDialog(false);
    };

    const hideDeletePerfilDialog = () => {
        setDeletePerfilDialog(false);
    };

    const hideDeletePerfilsDialog = () => {
        setDeletePerfilsDialog(false);
    };

    const saveUsuario = () => {
        if (!perfil.id) {
            //cadastrar
            perfilService
                .inserir(perfil)
                .then((response) => {
                    setPerfilDialog(false);
                    setPerfil(perfilVazio);
                    setPerfils([]);
                    toast?.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'User succesfuly created'
                    });
                })
                .catch((err) => {
                    toast?.current?.show({
                        severity: 'info',
                        summary: 'error!',
                        detail: 'Unexpected error creating user'
                    });
                    console.log(err);
                });
        }
        if (perfil.id) {
            //alterar
            perfilService
                .alterar(perfil)
                .then((response) => {
                    setPerfilDialog(false);
                    setPerfil(perfilVazio);
                    setPerfils([]);
                    toast?.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Profile succesfuly updated'
                    });
                })
                .catch((err) => {
                    toast?.current?.show({
                        severity: 'info',
                        summary: 'error!',
                        detail: 'Unexpected error updating Profile'
                    });
                    console.log(err);
                });
        }
    };

    const editPerfil = (perfil: Projeto.Perfil) => {
        setPerfil({ ...perfil });
        setPerfilDialog(true);
    };

    const confirmDeletePerfil = (perfil: Projeto.Perfil) => {
        setPerfil(perfil);
        setDeletePerfilDialog(true);
    };

    const deletePerfil = () => {
        perfilService
            .deletar(perfil.id)
            .then((response) => {
                setDeletePerfilDialog(false);
                setPerfil(perfilVazio);
                setPerfils(perfils.filter((val) => val.id !== perfil.id));
                toast?.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Profile succesfuly deleted'
                });
            })
            .catch((err) => {
                toast?.current?.show({
                    severity: 'info',
                    summary: 'error!',
                    detail: 'Unexpected error deleting Profile'
                });
                console.log(err);
            });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePerfilsDialog(true);
    };

    const deleteSelectedPerfils = () => {
        Promise.all(
            selectedPerfils.map(async (perfil) => {
                if (perfil.id) {
                    return await perfilService.deletar(perfil.id);
                }
            })
        )
            .then(() => {
                setSelectedPerfils([]);
                setPerfils([]);
                setDeletePerfilsDialog(false);
                toast?.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'profiles succesfuly deleted'
                });
            })
            .catch(() => {
                toast?.current?.show({
                    severity: 'error',
                    summary: 'error!',
                    detail: 'Unexpected error deleting profiles'
                });
            });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = e.target && e.target.value;
        if (val === undefined) return;
        let _perfil = { ...perfil };
        _perfil[`${name}`] = val;
        setPerfil(_perfil);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPerfils || !(selectedPerfils as any).length} />
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

    const idBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const idDescriptionTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {rowData.descricao}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfil(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfil(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage profiles</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const perfilDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveUsuario} />
        </>
    );
    const deletePerfilDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePerfilDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deletePerfil} />
        </>
    );
    const deletePefilsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedPerfils} />
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
                        value={perfils}
                        selection={selectedPerfils}
                        onSelectionChange={(e) => setSelectedPerfils(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Profile"
                        globalFilter={globalFilter}
                        emptyMessage="No Profile found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Code" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="descricao" header="Description" sortable body={idDescriptionTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Actions" body={actionBodyTemplate} headerStyle={{ width: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={perfilDialog} style={{ width: '450px' }} header="Profile Details" modal className="p-fluid" footer={perfilDialogFooter} onHide={hideDialog} draggable>
                        <div className="field">
                            <label htmlFor="descricao">Description</label>
                            <InputText
                                id="descricao"
                                type="text"
                                value={perfil.descricao}
                                onChange={(e) => {
                                    onInputChange(e, 'descricao');
                                }}
                                required={true}
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !perfil.descricao
                                })}
                            />
                            {submitted && !perfil.descricao && <small className="p-invalid">Description is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePerfilDialogFooter} onHide={hideDeletePerfilDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfil && (
                                <span>
                                    Are you sure you want to delete <b>{perfil.id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePefilsDialogFooter} onHide={hideDeletePerfilsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfils && <span>Are you sure you want to delete the selected profiles?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
