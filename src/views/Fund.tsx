import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { runQueries } from '@/util/query';
import { type FundDesc } from '@/util/query';
import { useFundStore } from '@/stores';
import { ElOption, ElPagination, ElSelect, ElTable, ElTableColumn } from 'element-plus';
import './table.scss'


const component = defineComponent({
  name: 'Fund',
  setup() {
    const fundStore = useFundStore();
    const pageSize = ref(10)
    const currentPage = ref(1)
    let descs = ref<FundDesc[]>([]);
    let data = ref<
      Array<{
        ticker: string;
        name: string;
        data: {
          dt: number;
          nav: number;
        }[];
      }>
    >([]);
    let total = ref<number>(0);
    const columns = ref([
      { prop: 'ticker', label: '基金代码' },
      { prop: 'name', label: '基金名称' },
      { prop: 'mgmt', label: '基金管理人' },
      { prop: 'custodian', label: '托管人' },
      { prop: 'incept dt', label: '成立日期' },
    ]);
    const selectOpts = ref<{
      label: string,
      value: string | number,
    }[]>([])

    let getData: Function;
    let closeConn: Function;
    const loadData = async () => {
      const db = await runQueries({
        urls: ['/fund-desc.parquet', '/fund-nav.parquet'],
      });
      fundStore.setDB(db);
      getData = db.getData as Function;
      closeConn = db.closeConn as Function;
      let all = await db.getTotal()
      total.value = all.total; //1000
      fundStore.setTickerOptions(all.tickers); // 存储基金代码
      descs.value = await db.getDesc(pageSize.value, currentPage.value);
      try {
        data.value = await Promise.all(
          descs.value.map(async (item) => {
            const dbult = await db.getData({ ticker: item.ticker });
            return {
              ticker: item.ticker,
              name: item.name,
              data: dbult,
            };
          })
        );
        console.log('获取数据成功:', data.value);
      } catch (error) {
        console.error('获取数据时出错:', error);
      }

    }
    onMounted(async () => {
      await loadData()
    })

    onBeforeUnmount(() => {
      // closeConn()
    })

    const handleCurrentChange = (newPage: number) => {
      currentPage.value = newPage
      loadData()
    }

    const handleSizeChange = (newSize: number) => {
      pageSize.value = newSize
      currentPage.value = 1
      loadData()
    }



    return () => (
      <div class="custom-table-container fund">
        <h1 class='custom-table-title'>基金信息列表</h1>
        <ElTable class="custom-table" data={descs.value} style={{ width: '100%' }}
        >
          {columns.value.map((col) => (
            <ElTableColumn align='center' key={col.prop} prop={col.prop} label={col.label} />
          ))}
        </ElTable>
        <div class='custom-pagination-wrapper' style={{ marginTop: '20px', textAlign: 'right', height: '50px' }}>
          <ElPagination
            currentPage={currentPage.value}
            pageSize={pageSize.value}
            pageSizes={[10, 20, 50, 100]}
            pageCount={Math.ceil(total.value / pageSize.value)}
            total={total.value}
            //@ts-ignore
            onCurrentChange={handleCurrentChange}
            onSizeChange={handleSizeChange}
          />
        </div>
      </div>
    )
  },
});

export default component;
