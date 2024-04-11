import {get, post} from "../util/api";


export const getMenuList = async <T>(): Promise<T> => {
    return get("/menu/list")
}

export const getMenuAllList = async <T>(): Promise<T> => {
    return get("/menu/getMenuAllList")
}


export const addMenu = async <T>(body:any): Promise<T> => {
    return post("/menu/batchAddMenu",body)
}
