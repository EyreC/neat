import VueEllipseProgress from 'vue-ellipse-progress';
import { createApp } from 'vue'
import App from './App.vue'


const app = createApp(App)
app.use(VueEllipseProgress)
app.mount('#app')