import { createApp } from 'vue'
import App from './App.vue'

// 引用 Bootstrap 的样式和 JS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

// 引用 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引用 animate.css
import 'animate.css'

// 导入 i18n 实例
import { createI18n } from 'vue-i18n'
import en from './locales/en';
import zh from './locales/zh';// 导入语言包
const messages = {
    en,
    zh,
};
// 创建 VueI18n 实例
const i18n = createI18n({
    locale: 'zh', // 设置默认语言
    messages, // 设置语言包
});

// 创建 Vue 应用
const app = createApp(App)

app.use(i18n)
// 使用 Element Plus 和 i18n
app.use(ElementPlus)
app.use(i18n) // 挂载 i18n 到 Vue 实例

// 挂载应用
app.mount('#app')