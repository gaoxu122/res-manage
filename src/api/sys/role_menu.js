import request from '../../utils/request';

export const selectMenusByRole = (params) => {
    return request({
        url: 'api/role_menu/select_menu_by_role',
        method: 'GET',
        params: params
    })
}