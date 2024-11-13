import axios from 'axios';

export const axiosIntance = axios.create({
    baseURL: 'http://localhost:8080'
});

export class UsuarioService {
    listarTodos() {
        return axiosIntance.get('/usuario');
    }

    inserir(usuario: Projeto.Usuario) {
        return axiosIntance.post('/usuario', usuario);
    }

    alterar(usuario: Projeto.Usuario) {
        return axiosIntance.put('/usuario', usuario);
    }

    deletar(id: number) {
        return axiosIntance.delete('/usuario/' + id);
    }
}
