<template>
  <div class="count" style="display: flex">
    <EChart :option="option" style="width: 1000px; height: 500px"> </EChart>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue';
//@ts-ignore
import { useFundStore } from '@/stores';
import * as echarts from 'echarts';
export default defineComponent({
  setup() {
    const fundStore = useFundStore();
    const countPerYear = computed(() => fundStore.getCountByYear());
    const date = Object.keys(countPerYear.value);
    const data = Object.values(countPerYear.value);

    let option = {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        },
      },
      title: {
        left: 'center',
        text: '基金成立数量走势图',
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date,
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          name: 'Fake Data',
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: 'rgb(255, 70, 131)',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 158, 68)',
              },
              {
                offset: 1,
                color: 'rgb(255, 70, 131)',
              },
            ]),
          },
          data: data,
        },
      ],
    };
    onMounted(() => {});

    return {
      option,
    };
  },
});
</script>

<style scoped></style>
