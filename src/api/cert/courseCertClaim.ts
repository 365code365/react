import {get, post} from "../../util/api";

export const createApply = async <T>(data?: object): Promise<T> => {
    return post("/courseCertClaim/create", data)
}

export const updateCertClaim = async <T>(data?: object): Promise<T> => {
    return post("/courseCertClaim/updateCertClaim", data)
}

export const getListByUserId = async <T>(data?: object): Promise<T> => {
    return get("/courseCertClaim/getListByUserId", data)
}

