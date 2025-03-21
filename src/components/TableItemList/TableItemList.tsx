import { RowData } from 'src/types';

export function TableItemList({ row }: { row: RowData }) {
  return (
    <ul className="table-content-list-2">
      <li className="table-content-2-item">{row.salary}</li>
      <li className="table-content-2-item">{row.equipmentCosts}</li>
      <li className="table-content-2-item">{row.overheads}</li>
      <li className="table-content-2-item">{row.estimatedProfit}</li>
    </ul>
  );
}
