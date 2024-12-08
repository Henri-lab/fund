import createTabs from '@/components/Tabs/index';
import { markRaw, ref } from 'vue';

export const tabsComp = createTabs(
  ref([
    {
      label: '基本信息',
      name: 'table',
      component: '/src/views/Fund.tsx',
    },
    {
      label: '每日净值',
      name: 'table2',
      component: '/src/views/Nav.tsx',
    },
    {
      label: '基金统计',
      name: 'table3',
      component: '/src/views/Owner.vue',
    },
  ]),
  {
    initName: 'table',
  }
);
