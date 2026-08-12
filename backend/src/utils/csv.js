// CSV export helper (Week 4) - used for telemetry / rule history export.
export function toCsv(rows, columns) {
  if (!Array.isArray(rows) || rows.length === 0) return '';
  const cols = columns ?? Object.keys(rows[0]);
  const escape = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = cols.map(escape).join(',');
  const body = rows.map((row) => cols.map((c) => escape(row[c])).join(','));
  return [header, ...body].join('\n');
}
