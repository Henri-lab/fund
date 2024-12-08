import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
export const useFundStore = defineStore('fund', () => {
  const tickersOptions = ref<{ label: string; value: string }[]>([]);
  const setTickerOptions = (options: { label: string; value: string }[]) => {
    tickersOptions.value = options;
  };
  const db=ref();
  const setDB= (d: any) => {
    db.value = d;
  };
  return {
    tickersOptions,
    setTickerOptions,
    db,
    setDB
  };
});
