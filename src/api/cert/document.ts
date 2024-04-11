import {post,get} from "../../util/api";

export const create = async <T>(data?: object): Promise<T> => {
    return post("/document/create", data)
}

export const list = async <T>(): Promise<T> => {
    return get("/document/list")
}
