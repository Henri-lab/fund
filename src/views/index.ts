import createTabs from '@/components/Tabs/index';
import { ref } from 'vue';

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
  ]),
  {
    initName:'table'
  }
);
