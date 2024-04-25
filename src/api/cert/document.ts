import {post,get} from "../../util/api";

export const createDocument = async <T>(data?: object): Promise<T> => {
    return post("/document/create", data)
}

export const list = async <T>(): Promise<T> => {
    return get("/document/list")
}

export const del = async <T>(data?: object): Promise<T> => {
    return post("/document/del",data)
}
