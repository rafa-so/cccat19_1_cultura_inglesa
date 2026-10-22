import axios from "axios";

export default interface HttpClient {
    get(url: string): Promise<any>;
    post(url: string, data: any): Promise<any>;
}

export class AxiosAdapter implements HttpClient {

    async get(url: string): Promise<any> {
        return axios.get(url);
    }

    async post(url: string, data: any): Promise<any> {
        return axios.post(url, data);
    }
}
