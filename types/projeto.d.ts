declare namespace Projeto {
    type Usuario = {
        id?: number;
        nome?: string;
        login?: string;
        senha?: string;
        email?: string;
    };

    type Recurso = {
        id?: number;
        nome?: string;
        chave?: string;
    };

    type Perfil = {
        id?: number;
        descricao?: string;
    };

    type PerfilUsuario = {
        id?: number;
        usuario?: Usuario;
        perfil?: Perfil;
    };

    type PermissaoRecursoPerfil = {
        id?: number;
        recurso?: Recurso;
        perfil?: Perfil;
    };
}
