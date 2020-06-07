import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";


import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)
Vue.config.productionTip = false
Vue.use(VueI18n);
// Vue.use(VideoPlayer);
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;

const i18n = new VueI18n({
    locale: 'zh',
    messages
})

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {

    // 获取 JWT Token
    const role = localStorage.getItem('JWT_TOKEN');
    console.log(role);
    
    // 如果用户在login页面 并解决无法点击注册直接注册的问题
    if (!role && to.path !== '/login' && to.path !=='/registered') {
        next("/login")
    } else {
        next()
    }


    // 判断用户是否存在
    // if ( to.path !== '/login') {
    //     // alert(to.path)
    //     next('/login');} else if (to) {
    //
    // }
    //
    // // } else if (to.meta.permission) {
    // //     // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    // //     role === 'admin' ? next() : next('/403');
    // // }
    //     else {
    //     // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    //     if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
    //         Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
    //             confirmButtonText: '确定'
    //         });
    //     } else {
    //         next();
    //     }
    // }
})


new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')
