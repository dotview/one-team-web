/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-30 17:37:28
 * @LastEditTime: 2019-08-16 11:30:40
 * @LastEditors: Please set LastEditors
 */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import Axios from 'axios'
import hljs from 'highlight.js'
import { FSS } from 'assets/js/FSS.js'
import { install as Global } from './global'
import Directives from 'assets/util/directives'
import 'highlight.js/styles/github.css'
import 'element-ui/lib/theme-chalk/index.css'
// import 'assets/style/element-variables.scss'
import 'github-markdown-css'
import {
    Input,
    Button,
    Alert,
    Row,
    Col,
    MessageBox,
    Message,
    Dialog,
    Form,
    FormItem,
    Loading,
    Card,
    Badge,
    InfiniteScroll
} from 'element-ui'

Vue.use(Directives)
Vue.use(Global)

Vue.use(Input)
Vue.use(Button)
Vue.use(Alert)
Vue.use(Row)
Vue.use(Col)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Loading)
Vue.use(Card)
Vue.use(Badge)
Vue.use(InfiniteScroll)

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message
Vue.prototype.$FSS = FSS
Vue.prototype.bus = new Vue()

Axios.defaults.withCredentials = true

Vue.directive('highlight', (el) => {
    let blocks = el.querySelectorAll('pre code')
    blocks.forEach((block) => {
        hljs.highlightBlock(block)
    })
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
