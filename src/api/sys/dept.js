import request from '../../utils/request';

export const getDeptTree = (params) => {
    return request({
        url: 'api/department/select_department_tree',
        method: 'GET',
        data: params
    })
}

export const insertDept = (params) => {
    return request({
        url: 'api/department/insert_department',
        method: 'POST',
        params: params
    })
}

export const updateUser = (params) => {
    return request({
        url: 'api/role/update_user',
        method: 'POST',
        data: params
    })
}
export const batchDeleteUser = (params) => {
    return request({
        url: 'api/role/batch_delete_user',
        method: 'POST',
        data: params
    })
}