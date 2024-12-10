import * as XLSX from "xlsx";

let wb = XLSX.utils.book_new();

self.onmessage = function (e) {
  const { data, header } = e.data;
  const MaxSheetSize = 500000;
  try {
    if (data.length <= MaxSheetSize) {
      const ws = addSheet(XLSX.utils.aoa_to_sheet([header]), data);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet");
    } else {
      const sheetCount = Math.ceil(data.length / MaxSheetSize);
      for (let i = 0; i < sheetCount; i++) {
        const start = i * MaxSheetSize;
        const end = start + MaxSheetSize;
        const sheetData = data.slice(start, end);
        const ws = addSheet(XLSX.utils.aoa_to_sheet([header]), sheetData);
        XLSX.utils.book_append_sheet(wb, ws, `Sheet${i + 1}`);
      }
    }
    let wbout = XLSX.write(wb, {
      bookType: "xlsx",
      type: "buffer",
      compression: true,
      cellStyles: false,
      sheetStubs: false,
      Props: {},
      Workbook: {
        Views: [{ RTL: false }],
        CalcPr: {},
        Sheets: [],
        Names: [],
      },
    });
    const blob = new Blob([new Uint8Array(wbout)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    wb = null;
    wbout = null;
    self.postMessage({ blob });
  } catch (error) {
    console.error("Error:", error);
    self.postMessage({ error: error.message });
  }
};

function addSheet(ws, data, progress) {
  const batchSize = 10000; // 每批处理的行数
  const totalRows = data.length;
  for (let i = 0; i < totalRows; i += batchSize) {
    let batch = data.slice(i, i + batchSize);
    XLSX.utils.sheet_add_aoa(ws, batch, { origin: -1 });
    batch = null;
  }
  return ws;
}
