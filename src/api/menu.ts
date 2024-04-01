import {get, post} from "../util/api";


export const getMenuList = async <T>(): Promise<T> => {
    return get("/menu/list")
}
