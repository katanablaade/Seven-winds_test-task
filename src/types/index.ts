export interface RowData {
  id: number;
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  child: RowData[];
}

export type FormData = {
  rowName: string;
  salary: string;
  equipmentCosts: string;
  overheads: string;
  estimatedProfit: string;
};
