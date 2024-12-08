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
      label: '基金所有者排名',
      name: 'table3',
      component: '/src/views/Owner.vue',
    },
    {
      label: '基金成立数量走势',
      name: 'table4',
      component: '/src/views/Count.vue',
    },
  ]),
  {
    initName: 'table',
  }
);
