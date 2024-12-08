import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { type FundDesc } from '@/util/query';
export const useFundStore = defineStore('fund', () => {
  const tickersOptions = ref<{ label: string; value: string }[]>([]);
  const setTickerOptions = (options: { label: string; value: string }[]) => {
    tickersOptions.value = options;
  };
  const allDesc = ref<FundDesc[]>([]);
  const setAllDesc = (o: FundDesc[]) => {
    allDesc.value = o;
  };
  const custodians = ref<string[]>([]);
  const setCustodians = (o: string[]) => {
    custodians.value = o;
  };
  const managers = ref<string[]>([]);
  const setManagers = (m: string[]) => {
    managers.value = m;
  };
  const db = ref();
  const setDB = (d: any) => {
    db.value = d;
  };

  const getTickers = (
    type: string
  ): {
    owner: string;
    tickers: { label: string; value: string }[];
  }[] => {
    let res: any = [];
    if (type === 'custodian') {
      return custodians.value.map((c) => {
        let tickers = allDesc.value.filter((item) => {
          return c === item.custodian;
        });
        return {
          owner: c,
          tickers: tickers.map((item) => {
            return {
              label: `${item.ticker} (${item.name})`,
              value: item.ticker,
            };
          }),
        };
      });
    } else if (type === 'manager') {
      return managers.value.map((m) => {
        let tickers = allDesc.value.filter((item) => {
          return m === item.mgmt;
        });
        return {
          owner: m,
          tickers: tickers.map((item) => {
            return {
              label: `${item.ticker} (${item.name})`,
              value: item.ticker,
            };
          }),
        };
      });
    } else {
      res = [];
    }
    return res;
  };

  const getCountByYear = () => {
    const result = allDesc.value.map((item) => {
      return {
        label: `${item.ticker} (${item.name})`,
        year: new Date(item['incept dt']).getFullYear(),
      };
    });
    const yearCount = result.reduce((acc, cur) => {
      const y = cur.year;
      acc[y] = (acc[y] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    return yearCount;
  };

  return {
    tickersOptions,
    setTickerOptions,
    db,
    setDB,
    custodians,
    setCustodians,
    managers,
    setManagers,
    allDesc,
    setAllDesc,
    getTickers,
    getCountByYear,
  };
});
