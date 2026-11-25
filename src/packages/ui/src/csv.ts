/** Construit un fichier CSV (séparateur « ; », lisible par Excel en français). */
export function toCsv(headers: string[], rows: (string | number)[][]): string {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  // BOM UTF-8 pour que les accents s'affichent correctement dans Excel
  return "﻿" + [headers, ...rows].map((r) => r.map(escape).join(";")).join("\r\n");
}

export function downloadText(filename: string, content: string, type = "text/csv;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
