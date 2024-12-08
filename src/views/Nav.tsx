import { computed, defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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
        let navsData = ref<FundDesc[]>([]);
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
            { prop: 'dt', label: '日期' },
            { prop: 'nav', label: '净值' },
        ]);
        const selectOpts = computed(() => fundStore.tickersOptions)
        const db = computed(() => fundStore.db)

        let getData: Function;
        let closeConn: Function;
        const loadData = async () => {
            getData = db.value.getData as Function;
            closeConn = db.value.closeConn as Function;
        }
        onMounted(async () => {
            await loadData()
        })
        watch(() => db.value, () => {
            loadData()
        }, { immediate: true })

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
        let transformedData = ref<{ dt: string, nav: number }[]>([]);
        const currentPageData = computed(() => {
            const startIndex = (currentPage.value - 1) * pageSize.value;
            const endIndex = startIndex + pageSize.value;
            return transformedData.value.slice(startIndex, endIndex);
        })
        const handleSelectChange = async (value: string | number) => {
            const result = await getData({ ticker: value });
            total.value = result.length;
            // 截取出当前页的数据
            transformedData.value = result.map((item: { dt: string, nav: string }) => {
                return {
                    dt: new Date(item.dt).toLocaleDateString(),
                    nav: Number(item.nav),
                };
            })
        }


        return () => (
            <div class="custom-table-container fund">
                <h1 class='custom-table-title'>净值列表</h1>
                <ElSelect onChange={handleSelectChange} placeholder="请选择基金">
                    {selectOpts.value.map((item) => (
                        <ElOption key={item.value} label={item.label} value={item.value} />
                    ))}
                </ElSelect>
                <ElTable class="custom-table" data={currentPageData.value} style={{ width: '100%' }}
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
