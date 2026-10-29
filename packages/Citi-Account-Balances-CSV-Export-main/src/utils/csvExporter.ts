export const exportTransactionsToCsv = (transactions: any[], filename = 'citi-transactions.csv') => {
  exportToCsv(filename, transactions);
};

export const exportAccountsSummaryToCsv = (accounts: any[], filename = 'citi-accounts-summary.csv') => {
  exportToCsv(filename, accounts);
};

export const exportCombinedFinancialCsv = (data: any[], filename = 'citi-combined-financial.csv') => {
  exportToCsv(filename, data);
};

export const downloadCsv = (data: any[], filename = 'export.csv') => {
  exportToCsv(filename, data);
};

export const exportToCsv = (filename: string, rows: object[]) => {
  if (!rows || !rows.length) {
    return;
  }
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent = [
    keys.join(separator),
    ...rows.map(row => keys.map(k => {
      let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
      cell = cell instanceof Date ? cell.toISOString() : clandestineString(cell);
      cell = cell.replace(/"/g, '""');
      return `"${cell}"`;
    }).join(separator))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

function clandestineString(val: any) {
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
}
