import { useState, useEffect } from 'react';
import { addTree, deleteFromTree, updateTree } from '../Table/Table.service';
import { createRowInEntity, getTreeRows } from 'src/services/api';
import TableItem from '../TableItem/TableItem';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { TableNewItem } from '../TableNewItem/TableNewItem';
import './TableRow.style.scss';
import { FormData, RowData } from 'src/types';
import { SubmitHandler } from 'react-hook-form';
import { GlobalProvider } from '../GlobalContext/GlobalContext';

export function TableRow() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Добавление нового элемента
  const handleAdd = (newItem: RowData, parentId: number | null = null) => {
    setRows((prev) => addTree(prev, newItem, parentId));
  };

  // Удаление элемента
  const handleDelete = (current: RowData | null, changed: RowData[]) => {
    const deletedId = changed[0]?.id;
    if (deletedId) {
      setRows((prev) => deleteFromTree(prev, deletedId));
    }
  };

  // Обновление элемента
  const handleUpdate = (current: RowData | null, changed: RowData[]) => {
    const updatedItems = current ? [current, ...changed] : changed;
    setRows((prev) => updateTree(prev, updatedItems));
  };

  // Загрузка данных
  const fetchRows = async () => {
    setIsLoading(true);
    try {
      const fetchedRows = await getTreeRows();
      setRows(fetchedRows);
    } catch (error) {
      setErrors((prevErrors) => [...prevErrors, 'Ошибка при загрузке данных']);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработка отправки формы для создания первой строки
  const onSubmitFirstItem: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const res = await createRowInEntity({
        rowName: data.rowName,
        salary: Number(data.salary),
        equipmentCosts: Number(data.equipmentCosts),
        overheads: Number(data.overheads),
        estimatedProfit: Number(data.estimatedProfit),
        parentId: null,
      });

      const { current } = res;
      const newItem: RowData = {
        id: current.id,
        rowName: current.rowName,
        salary: current.salary,
        equipmentCosts: current.equipmentCosts,
        overheads: current.overheads,
        estimatedProfit: current.estimatedProfit,
        child: [],
      };

      handleAdd(newItem, null);
    } catch (error) {
      console.error('Ошибка при создании строки:', error);
      setErrors((prevErrors) => [...prevErrors, 'Ошибка при создании строки']);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  if (errors.length > 0) {
    return (
      <div>
        {errors.map((error, index) => (
          <ErrorMessage key={index} message={error} />
        ))}
      </div>
    );
  }

  if (isLoading) return <Spinner />;

  return (
    <GlobalProvider>
      <div className="table-content ">
        {rows.length === 0 ? (
          <TableNewItem pl={10} onSubmit={onSubmitFirstItem} />
        ) : (
          rows.map((row) => (
            <TableItem
              key={row.id}
              row={row}
              handleAdd={handleAdd}
              onUpdate={handleUpdate}
              handleDelete={handleDelete}
              pl={10}
            />
          ))
        )}
      </div>
    </GlobalProvider>
  );
}
