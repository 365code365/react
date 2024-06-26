import {get, post} from "../../util/api";

export const createApply = async <T>(data?: object): Promise<T> => {
    return post("/courseCertClaim/create", data)
}

export const updateCertClaim = async <T>(data?: object): Promise<T> => {
    return post("/courseCertClaim/updateCertClaim", data)
}

export const getDetail = async <T>(data?: object): Promise<T> => {
    return post("/courseCertClaim/getDetail", data)
}


export const getListById = async <T>(data?: object): Promise<T> => {
    return post("/courseCertClaim/getListById", data)
}

export const getGradeProcess = async <T>(data?: object): Promise<T> => {
    return post("/courseCertClaim/getGradeProcess", data)
}

