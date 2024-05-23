import {post, get} from "../../util/api";

export const create = async <T>(data?: object): Promise<T> => {
    return post("/cert/create", data)
}


export const listAll = async <T>(): Promise<T> => {
    return get("/cert/listAll")
}


export const del = async <T>(data?: object): Promise<T> => {
    return post("/cert/del", data)
}


export const getDetail = async <T>(data?: object): Promise<T> => {
    return post("/cert/getDetail", data)
}
