import request from '../../utils/request';

export const getMenuTree = (params) => {
    return request({
        url: 'api/menu/select_menu_tree',
        method: 'GET',
        params: params
    })
}

export const insertMenu = (params) => {
    return request({
        url: 'api/menu/add_menu',
        method: 'POST',
        data: params
    })
}

export const updateMenu = (params) => {
    return request({
        url: 'api/menu/update_menu',
        method: 'PUT',
        data: params
    })
}

export const deleteMenu = (params) => {
    return request({
        url: 'api/menu/delete_menu',
        method: 'DELETE',
        params: params
    })
}

export const enableMenu = (params) => {
    return request({
        url: 'api/menu/menu_enable',
        method: 'post',
        data: params
    })
}
