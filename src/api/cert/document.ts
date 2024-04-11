import {post} from "../../util/api";

export const create = async <T>(data?: object): Promise<T> => {
    return post("/document/create", data)
}
