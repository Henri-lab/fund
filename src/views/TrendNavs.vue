<template>
  <div class="trend-navs">
    <div class="select" style="display: flex">
      <el-select
        v-model="selected"
        placeholder="请选择基金"
        :options="selectOpts"
        @change="handleSelect"
      >
        <el-option
          v-for="item in selectOpts"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-date-picker
        v-model="selectedRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleChange"
        :picker-options="pickerOptions"
      ></el-date-picker>
    </div>
    <EChart :option="option" style="width: 1000px; height: 500px"> </EChart>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue';
import { ElDatePicker, ElMessage } from 'element-plus';
//@ts-ignore
import { useFundStore } from '@/stores';
import * as echarts from 'echarts';
export default defineComponent({
  components: { ElDatePicker },
  setup() {
    let option = ref({});
    const fundStore = useFundStore();
    const db = computed(() => fundStore.db);
    const selectOpts = computed(() => fundStore.tickersOptions);
    const selected = ref('');
    const allNavs = ref([]);
    let minDate, maxDate;
    const pickerOptions = {
      disabledDate(time) {
        // 不允许选择今天之后的日期
        return time.getTime() > Date.now();
      },
    };

    const selectedRange = ref([]);
    const timestamps = ref([]);

    const handleSelect = async (value) => {
      let res = await db.value.getData({ ticker: value });
      res.sort((a, b) => a.dt - b.dt);
      minDate = res[0].dt;
      maxDate = res[res.length - 1].dt;
      selectedRange.value = [minDate, maxDate];
      allNavs.value = res;
      if (selectedRange.value.length == 0) {
        ElMessage.success('请选择日期区间');
      } else {
        timestamps.value = [minDate, maxDate];
        option.value = loadTrend();
      }
    };

    const handleChange = (values) => {
      console.log('选择的日期区间:', values);
      timestamps.value = values.map((value) => new Date(value).getTime());
      if (allNavs.value.length == 0) {
        ElMessage.success('请选择基金名称');
      } else {
        option.value = loadTrend();
      }
    };

    const loadTrend = () => {
      if (allNavs.value.length == 0 && timestamps.value.length == 0) {
        ElMessage.warning('请先选择基金名称和日期区间');
        return;
      }
      const data = allNavs.value.filter(
        (item) =>
          item.dt <= timestamps.value[1] && item.dt >= timestamps.value[0]
      );
      console.log(allNavs.value, timestamps.value);

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        xAxis: {
          type: 'category',
          data: data.map((item) => new Date(item.dt).toLocaleString()),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: data.map((item) => item.nav),
            type: 'line',
          },
        ],
      };
      return option;
    };

    onMounted(() => {});

    return {
      selectOpts,
      selected,
      selectedRange,
      handleChange,
      handleSelect,
      option,
      pickerOptions,
      timestamps,
    };
  },
});
</script>

<style scoped></style>
