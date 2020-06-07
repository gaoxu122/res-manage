import request from '../utils/request';

export const sendmail = (params) => {
    return request({
        url: 'api/email/sendEmail',
        method: 'post',
        data: params
    })
}

export const selectMail = (params) => {
    return request({
        url: 'api/email/selectMail',
        method: 'get',
        data: params
    })
}