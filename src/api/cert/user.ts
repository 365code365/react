import {get, post} from "../../util/api";

export const createUser = async <T>(data?: object[]): Promise<T> => {
    return post("/user/createUser", data)
}



export const list = async <T>(): Promise<T> => {
    return get("/user/list")
}
