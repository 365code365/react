import {get, post} from "../util/api";


export const login = async <T>(data?: object): Promise<T> => {
    return post("/auth/login", data)
}


export const register = async <T>(data?: object): Promise<T> => {
    return post("/auth/register", data)
}

export const getAllUser = async <T>(): Promise<T> => {
    return get("/auth/getAllUser",{})
}
