import { TableRow } from '../TableRow/TableRow';
import './Table.style.scss';

export function Table() {
  return (
    <div className="table">
      <div className="table-captures">
        <ul className="table-captures-1">
          <li className="table-captures-1-item">Уровень</li>
          <li className="table-captures-1-item">Наименование работ</li>
        </ul>
        <ul className="table-captures-2">
          <li className="table-captures-2-item">Основная з/п</li>
          <li className="table-captures-2-item">Оборудование</li>
          <li className="table-captures-2-item">Накладные расходы</li>
          <li className="table-captures-2-item">Сметная прибыль</li>
        </ul>
      </div>
      <TableRow />
    </div>
  );
}
