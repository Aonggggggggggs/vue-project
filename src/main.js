import "./style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
// import dayjs from "dayjs";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

// Vue.prototype.$dayjs = dayjs;

app.component("VueDatePicker", VueDatePicker);
app.use(createPinia());
app.use(router);

app.mount("#app");
