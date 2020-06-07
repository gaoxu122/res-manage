import request from '../../utils/request';

export const getRole = (params) => {
    return request({
        url: 'api/role/select_role',
        method: 'GET',
        params: params
    })
}

export const insertRole = (params) => {
    return request({
        url: 'api/role/insert_role',
        method: 'POST',
        data: params
    })
}

export const updateRole = (params) => {
    return request({
        url: 'api/role/update_role',
        method: 'PUT',
        data: params
    })
}

export const deleteRole = (params) => {
    return request({
        url: 'api/role/delete_role',
        method: 'DELETE',
        params: params
    })
}

export const batchDeleteRole = (params) => {
    return request({
        url: 'api/role/delete_role',
        method: 'DELETE',
        data: params
    })
}

export const selectNoPermissionUsers = (params) => {
    return request({
        url: 'api/role_user/select_permission',
        method: 'GET',
        params: params
    })
}

export const selectPermissionUsers = (params) => {
    return request({
        url: 'api/role_user/select_permission_user',
        method: 'GET',
        params: params
    })
}

