<template>
  <div class="owner" style="display: flex">
    <EChart :option="option" style="width: 500px; height: 500px"> </EChart>
    <EChart :option="option2" style="width: 500px; height: 500px"> </EChart>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
//@ts-ignore
import { useFundStore } from '@/stores';
export default defineComponent({
  setup() {
    const mangers = ref([]);
    const custodians = ref([]);
    const fundStore = useFundStore();
    mangers.value = (function () {
      return fundStore.getTickers('manager').map((item) => {
        return {
          name: item.owner,
          value: item.tickers.length,
        };
      });
    })();
    custodians.value = (function () {
      return fundStore.getTickers('custodian').map((item) => {
        return {
          name: item.owner,
          value: item.tickers.length,
        };
      });
    })();
    mangers.value.length = 10;
    custodians.value.length = 10;
    console.log(mangers.value);
    console.log(custodians.value);

    const option = ref({
      backgroundColor: '#2c343c',
      title: {
        text: '管理者前十',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      visualMap: {
        show: false,
        min: 0,
        max: 100,
        inRange: {
          colorLightness: [0, 1],
        },
      },
      series: [
        {
          name: 'managemens',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: mangers.value.sort(function (a, b) {
            return a.value - b.value;
          }),
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 0.3)',
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)',
            },
            smooth: 0.2,
            length: 10,
            length2: 20,
          },
          itemStyle: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          },
        },
      ],
    });

    const option2 = ref({
      backgroundColor: '#2c343c',
      title: {
        text: '托管者前十',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      visualMap: {
        show: false,
        min: 0,
        max: 200,
        inRange: {
          colorLightness: [0, 1],
        },
      },
      series: [
        {
          name: 'managemens',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: custodians.value.sort(function (a, b) {
            return a.value - b.value;
          }),
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 0.3)',
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)',
            },
            smooth: 0.2,
            length: 10,
            length2: 20,
          },
          itemStyle: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          },
        },
      ],
    });
    onMounted(() => {});

    return {
      option,
      option2,
    };
  },
});
</script>

<style scoped></style>
