import "./style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import VueDragSelect from "@coleqiu/vue-drag-select";
import VueApexCharts from "vue3-apexcharts";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(VueDragSelect);
app.component("VueDatePicker", VueDatePicker);
app.use(createPinia());
app.use(router);
app.use(VueApexCharts);

app.mount("#app");
