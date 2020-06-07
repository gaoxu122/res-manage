import request from '../utils/request';

export const SyncVideoType = () => {
    return request({
        url: 'api/video/sync_video_type',
        method: 'post',
    })
}

export const SelectVideoType=()=>{
    return Request({
        url:'api/video/select_all_video_type',
        method:'post'
    })
}