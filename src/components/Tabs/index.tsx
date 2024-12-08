import {
  defineComponent,
  markRaw,
  reactive,
  ref,
  onMounted,
  type Component,
  type Ref,
  watch,
} from 'vue';
//@ts-ignore
import Tabs from './index.vue';

export interface TabConfig {
  label: string;
  name: string;
  component: Component | string;
  icon?: string;
  content?: string;
}
export interface extra{
  initName?: string
}

// 动态加载组件
const loadComponentPath = async (path: string): Promise<Component | null> => {
  try {
    const component = await import(path);
    return markRaw(component.default || component);
  } catch (error) {
    console.error(`Failed to load component at path: ${path}`, error);
    return null; // 返回空组件或错误占位组件
  }
};

// 使用函数生成 Tabs 组件
export default function createTabsComponent(tabsConfig: Ref<TabConfig[]>, extra?: extra) {
  const tabsComp = defineComponent({
    name: 'DynamicTabs',
    components: { Tabs },
    setup() {
      const tabs: Ref<TabConfig[]> = ref([]);
      const initName = extra?.initName || 'first'
      const parse = async () => {
        tabs.value = await Promise.all(
          tabsConfig.value.map(async (tab) => ({
            label: tab.label,
            name: tab.name,
            component:
              typeof tab.component === 'string'
                ? await loadComponentPath(tab.component) || defineComponent({})
                : tab.component,
            icon: tab.icon || 'el-icon-default',
            content: tab.content || '',
          }))
        );
        // console.log(tabs.value);
      }
      onMounted(async () => {
        parse()
      });
      watch(() => tabsConfig.value, () => {
        parse()
      })


      return () => (
        <div class="tabs-basicInfos-and-images">
          {tabs.value.length > 0 ? (
            <Tabs
              tabs={tabs.value}
              isGuard={false}
              isControlPanel={false}
              initName={initName}
            />
          ) : (
            <div>加载中...</div>
          )}
        </div>
      );
    },
  });
  return markRaw(tabsComp)
}