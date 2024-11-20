/* eslint-disable @next/next/no-img-element */
'use client';
import { PerfilService } from '@/service/PerfilService';
import { PermissaoRecursoPerfilService } from '@/service/PermissaoRecursoPerfilService';
import { RecursoService } from '@/service/RecursoService';
import { Projeto } from '@/types';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const Crud = () => {
    let permissaoRecursoPefilVazio: Projeto.PermissaoRecursoPerfil = {
        id: 0,
        recurso: { nome: '', chave: '' },
        perfil: { descricao: '' }
    };

    const [permissaoRecursoPerfils, setPermissaoRecursoPerfils] = useState<Projeto.PermissaoRecursoPerfil[]>([]);
    const [permissaoRecursoPerfilDialog, setPermissaoRecursoPerfilDialog] = useState(false);
    const [deletePermissaoRecursoPerfilDialog, setDeletePermissaoRecursoPerfilDialog] = useState(false);
    const [deletePermissaoRecursoPerfilsDialog, setDeletePermissaoRecursoPerfilsDialog] = useState(false);
    const [permissaoRecursoPerfil, setPermissaoRecursoPerfil] = useState<Projeto.PermissaoPermissaoRecursoPerfil>(permissaoRecursoPefilVazio);
    const [selectedPermissaoRecursoPerfils, setSelectedPermissaoRecursoPerfils] = useState<Projeto.PermissaoPermissaoRecursoPerfilPerfil[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const recursoService = useMemo(() => new RecursoService(), []);
    const perfilService = useMemo(() => new PerfilService(), []);

    const [recursos, setRecursos] = useState<Projeto.Recurso[]>([]);
    const [perfils, setPerfils] = useState<Projeto.Perfil[]>([]);

    useEffect(() => {
        if (permissaoRecursoPerfilDialog) {
            recursoService
                .listarTodos()
                .then((response) => {
                    setRecursos(response.data);
                })
                .catch((error) => console.log(error));

            perfilService
                .listarTodos()
                .then((response) => {
                    setPerfils(response.data);
                })
                .then((error) => console.log(error));
        }
    }, [permissaoRecursoPerfilDialog, recursoService, perfilService]);

    const permissaoRecursoPerfilService = useMemo(() => new PermissaoRecursoPerfilService(), []);
    useEffect(() => {
        if (permissaoRecursoPerfils.length === 0) {
            permissaoRecursoPerfilService
                .listarTodos()
                .then((response) => {
                    setPermissaoRecursoPerfils(response.data);
                })
                .catch((error) => console.log(error));
        }
    }, [permissaoRecursoPerfils, permissaoRecursoPerfilService]);

    const openNew = () => {
        setPermissaoRecursoPerfil(permissaoRecursoPefilVazio);
        setSubmitted(false);
        setPermissaoRecursoPerfilDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPermissaoRecursoPerfilDialog(false);
    };

    const hideDeletePermissaoRecursoPerfilDialog = () => {
        setDeletePermissaoRecursoPerfilDialog(false);
    };

    const hideDeletePermissaoRecursoPerfilsDialog = () => {
        setDeletePermissaoRecursoPerfilsDialog(false);
    };

    const savePermissaoRecursoPerfil = () => {
        if (!permissaoRecursoPerfil.id) {
            //cadastrar
            permissaoRecursoPerfilService
                .inserir(permissaoRecursoPerfil)
                .then((response) => {
                    setPermissaoRecursoPerfilDialog(false);
                    setPermissaoRecursoPerfil(permissaoRecursoPefilVazio);
                    setPermissaoRecursoPerfils([]);
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
        if (permissaoRecursoPerfil.id) {
            //alterar
            permissaoRecursoPerfilService
                .alterar(permissaoRecursoPerfil)
                .then((response) => {
                    setPermissaoRecursoPerfilDialog(false);
                    setPermissaoRecursoPerfil(permissaoRecursoPefilVazio);
                    setPermissaoRecursoPerfils([]);
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

    const editPermissaoRecursoPerfil = (permissaoRecursoPerfil: Projeto.PermissaoPermissaoRecursoPerfilPerfil) => {
        setPermissaoRecursoPerfil({ ...permissaoRecursoPerfil });
        setPermissaoRecursoPerfilDialog(true);
    };

    const confirmDeletePermissaoRecursoPerfil = (permissaoRecursoPerfil: Projeto.PermissaoPermissaoRecursoPerfilPerfil) => {
        setPermissaoRecursoPerfil(permissaoRecursoPerfil);
        setDeletePermissaoRecursoPerfilDialog(true);
    };

    const deletePermissaoRecursoPerfil = () => {
        permissaoRecursoPerfilService
            .deletar(permissaoRecursoPerfil.id)
            .then((response) => {
                setDeletePermissaoRecursoPerfilDialog(false);
                setPermissaoRecursoPerfil(permissaoRecursoPefilVazio);
                setPermissaoRecursoPerfils(permissaoRecursoPerfils.filter((val) => val.id !== permissaoRecursoPerfil.id));
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
        setDeletePermissaoRecursoPerfilsDialog(true);
    };

    const deleteSelectedPermissaoRecursoPerfils = () => {
        Promise.all(
            selectedPermissaoRecursoPerfils.map(async (permissaoRecursoPerfil) => {
                if (permissaoRecursoPerfil.id) {
                    return await permissaoRecursoPerfilService.deletar(permissaoRecursoPerfil.id);
                }
            })
        )
            .then(() => {
                setSelectedPermissaoRecursoPerfils([]);
                setPermissaoRecursoPerfils([]);
                setDeletePermissaoRecursoPerfilsDialog(false);
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
        // let _recurso = { ...permissaoRecursoPerfil };
        // _recurso[`${name}`] = val;
        // setPermissaoRecursoPerfil(_recurso);

        setPermissaoRecursoPerfil((prevPermissaoRecursoPerfil: Projeto.PermissaoPermissaoRecursoPerfilPerfil) => ({
            ...prevPermissaoRecursoPerfil,
            [name]: val
        }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPermissaoRecursoPerfils || !(selectedPermissaoRecursoPerfils as any).length} />
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

    const idBodyTemplate = (rowData: Projeto.PermissaoRecursoPerfil) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const recursoBodyTemplate = (rowData: Projeto.PermissaoRecursoPerfil) => {
        return (
            <>
                <span className="p-column-title">Recurso</span>
                {rowData.recurso?.nome}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Projeto.Perfil) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfil?.descricao}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.PermissaoPermissaoRecursoPerfilPerfil) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPermissaoRecursoPerfil(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePermissaoRecursoPerfil(rowData)} />
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

    const permissaoRecursoPerfilDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={savePermissaoRecursoPerfil} />
        </>
    );
    const deletePermissaoRecursoPerfilDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePermissaoRecursoPerfilDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deletePermissaoRecursoPerfil} />
        </>
    );
    const deletePermissaoRecursoPerfilsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedPermissaoRecursoPerfils} />
        </>
    );

    const onRecursoChange = (recurso: Projeto.Recurso) => {
        let _PermissaoRecursoPerfil = { ...permissaoRecursoPerfil };
        _PermissaoRecursoPerfil.recurso = recurso;
        setPermissaoRecursoPerfil(_PermissaoRecursoPerfil);
    };

    const onPerfilChange = (e: DropdownChangeEvent) => {
        let _PermissaoRecursoPerfil = { ...permissaoRecursoPerfil };
        _PermissaoRecursoPerfil.perfil = e.value;
        setPermissaoRecursoPerfil(_PermissaoRecursoPerfil);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={permissaoRecursoPerfils}
                        selection={selectedPermissaoRecursoPerfils}
                        onSelectionChange={(e) => setSelectedPermissaoRecursoPerfils(e.value as any)}
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
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="recurso" header="Recurso" sortable body={recursoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="action" header="Actions" sortable body={actionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={permissaoRecursoPerfilDialog} style={{ width: '450px' }} header="Resource Details" modal className="p-fluid" footer={permissaoRecursoPerfilDialogFooter} onHide={hideDialog} draggable>
                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <Dropdown options={perfils} optionLabel="descricao" filter value={permissaoRecursoPerfil.perfil} onChange={(e) => onPerfilChange(e)} />
                            {submitted && !permissaoRecursoPerfil.perfil && <small className="p-invalid">Perfil is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="recurso">Recurso</label>
                            <Dropdown options={recursos} optionLabel="nome" filter value={permissaoRecursoPerfil.recurso} onChange={(e) => onRecursoChange(e.value)} />
                            {submitted && !permissaoRecursoPerfil.recurso && <small className="p-invalid">Recurso is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePermissaoRecursoPerfilDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePermissaoRecursoPerfilDialogFooter} onHide={hideDeletePermissaoRecursoPerfilDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoRecursoPerfil && (
                                <span>
                                    Are you sure you want to delete <b>{permissaoRecursoPerfil.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePermissaoRecursoPerfilsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePermissaoRecursoPerfilsDialogFooter} onHide={hideDeletePermissaoRecursoPerfilsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoRecursoPerfils && <span>Are you sure you want to delete the selected resourses?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
