import axios from 'axios';

export const axiosIntance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_API
});

export class BaseService {
    url: string;

    constructor(url: string) {
        this.url = url;
    }

    listarTodos() {
        return axiosIntance.get(this.url);
    }

    buscarPorId(id: number) {
        return axiosIntance.get(this.url + '/' + id);
    }

    inserir(object: any) {
        return axiosIntance.post(this.url, object);
    }

    alterar(object: any) {
        return axiosIntance.put(this.url, object);
    }

    deletar(id: number) {
        return axiosIntance.delete(this.url + '/' + id);
    }
}
