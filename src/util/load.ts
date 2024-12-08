import { AsyncDuckDB } from '@duckdb/duckdb-wasm';

export async function loadParquetFiles(db: AsyncDuckDB, urls: string[]) {
  // 使用 Promise.all 并行获取所有文件响应
  const responses = await Promise.all(urls.map((url) => fetch(url)));

  // 检查是否有请求失败
  for (const resp of responses) {
    if (!resp.ok) {
      throw new Error(`Failed to fetch parquet file: ${resp.url}`);
    }
  }

  // 将所有响应转为 Uint8Array
  const filesData = await Promise.all(
    responses.map(async (resp) => {
      const data = new Uint8Array(await resp.arrayBuffer());
      return { url: resp.url, data };
    })
  );

  // 将文件注册到 DuckDB 虚拟文件系统
  // 从 url 中截取文件名作为虚拟文件名
  for (const { url, data } of filesData) {
    const fileName = url.split('/').pop() || '_.parquet';
    await db.registerFileBuffer(fileName, data);
  }
}
