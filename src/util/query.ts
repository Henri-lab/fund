// queryExample.ts
import { initDB } from './init';
import { loadParquetFiles } from './load';

export type FundDesc = {
  ticker: string;
  name: string;
  mgmt: string;
  custodian: string;
  'incept dt': number;
};

export async function runQueries(options: any = {}) {
  const db = await initDB();
  await loadParquetFiles(db, options.urls);
  const conn = await db.connect();
  return {
    closeConn: () => conn.close(),
    getTotal: async () => {
      let res = (
        await conn.query(
          `
        SELECT * 
        FROM read_parquet('fund-desc.parquet')
      `
        )
      ).toArray();
      let total = res.length;
      let tickers = res.map((item: FundDesc) => {
        return {
          label: `${item.ticker} (${item.name})`,
          value: item.ticker,
        };
      });
      let allDescs = res.map((item: FundDesc) => {
        return {
          ticker: item.ticker,
          name: item.name,
          mgmt: item.mgmt,
          custodian: item.custodian,
          'incept dt': item['incept dt'],
        } as FundDesc;
      });
      return {
        total,
        tickers,
        allDescs,
      };
    },
    getDesc: async (pageSize: number, curPage: number) => {
      const offset = (curPage - 1) * pageSize;
      const FundDescResult = await conn.query(`
        SELECT * 
        FROM read_parquet('fund-desc.parquet')
        LIMIT ${pageSize} 
        OFFSET ${offset}
      `);
      return FundDescResult.toArray().map((item) => {
        return {
          ticker: item.ticker,
          name: item.name,
          mgmt: item.mgmt,
          custodian: item.custodian,
          'incept dt': item['incept dt'],
        } as FundDesc;
      });
    },

    getData: async ({ ticker }: { ticker: string }) => {
      const navResult = await conn.query(`
        SELECT dt, nav
        FROM read_parquet('fund-nav.parquet')
        WHERE ticker = '${ticker}'
        ORDER BY dt
      `);
      return navResult.toArray().map((item) => {
        return {
          dt: item.dt,
          nav: item.nav,
        };
      });
    },
  };
}
