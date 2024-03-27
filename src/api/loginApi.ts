import {post} from "../util/api";


export const login = async <T>(data?: object): Promise<T> => {
    return post("auth/login", data)
}


export const register = async <T>(data?: object): Promise<T> => {
    return post("auth/register", data)
}
