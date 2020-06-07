import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' //来判断是否开发环境
    baseURL: 'http://localhost:8762',
    timeout: 6000
})


service.interceptors.request.use( config => {
    
    
     // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (localStorage.JWT_TOKEN) { 
        config.headers.Authorization = `${localStorage.JWT_TOKEN}`;
      }
    return config;
}, error => {
    console.log(error);
    return Promise.reject();
})

service.interceptors.response.use(response => {
    console.log(response.status)
    if(response.status === 200){
        console.log(response.data)
        if(response.data.status === 506){
            localStorage.removeItem('JWT_TOKEN')
            localStorage.removeItem('ms_username')
            this.$router.push('/login');
        }
        return response.data;
    }else {
        Promise.reject();
    }
}, error => {
    console.log(error);
    return Promise.reject();
})

export default service;
