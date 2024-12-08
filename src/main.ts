import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as ElmentPlus from 'element-plus';
import 'element-plus/dist/index.css';
import ECharts from 'vue-echarts';
import { use } from 'echarts/core';

import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
use([
  CanvasRenderer,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
]);

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElmentPlus);
app.component('EChart', ECharts);
app.mount('#app');
