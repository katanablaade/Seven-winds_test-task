import { memo, useCallback, useEffect, useState } from 'react';
import { deleteRow, createRowInEntity, updateRow } from 'src/services/api';
import { TableNewItem } from '../TableNewItem/TableNewItem';
import { useGlobal } from '../GlobalContext/GlobalContext';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { FormData, RowData } from 'src/types';
import './TableItem.style.scss';
import add from '../../assets/add.png';
import del from '../../assets/delete.png';
import { useForm } from 'react-hook-form';
import { TableItemList } from '../TableItemList/TableItemList';
interface TableItemProps {
  row: RowData;
  pl?: number;
  onUpdate: (current: RowData | null, changed: RowData[]) => void;
  handleAdd: (newItem: RowData, parentId: number | null) => void;
  handleDelete: (current: RowData | null, changed: RowData[]) => void;
}
const TableItem = memo(
  ({ row, onUpdate, handleAdd, handleDelete, pl = 0 }: TableItemProps) => {
    const [isVisibleNewItem, setIsVisibleNewItem] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isHovered, setIsHovered, isBlocked, setIsBlocked } = useGlobal();
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>({
      defaultValues: {
        rowName: row.rowName,
        salary: row.salary.toString(),
        equipmentCosts: row.equipmentCosts.toString(),
        overheads: row.overheads.toString(),
        estimatedProfit: row.estimatedProfit.toString(),
      },
    });

    // Функции управления состоянием
    const toggleEdit = useCallback(() => {
      if (!isBlocked) {
        setIsEditing((prev) => !prev);
        setIsBlocked(!isEditing);
      }
    }, [isBlocked, isEditing]);

    const openNewForm = useCallback(() => {
      if (!isBlocked) {
        setIsVisibleNewItem(true);
        setIsBlocked(true);
      }
    }, [isBlocked]);

    const closeNewForm = useCallback(() => {
      setIsVisibleNewItem(false);
      setIsBlocked(false);
    }, []);

    const exitAddMode = useCallback(() => {
      if (isVisibleNewItem) {
        setIsVisibleNewItem(false);
        setIsBlocked(false);
      }
    }, [isVisibleNewItem]);

    const exitEditMode = useCallback(() => {
      if (isEditing) {
        setIsEditing(false);
        setIsBlocked(false);
      }
    }, [isEditing]);

    // Запросы
    const addRowData = useCallback(
      async (data: FormData) => {
        setIsLoading(true);
        setError(null);
        setIsBlocked(true);
        try {
          const res = await createRowInEntity({
            rowName: data.rowName,
            salary: Number(data.salary),
            equipmentCosts: Number(data.equipmentCosts),
            overheads: Number(data.overheads),
            estimatedProfit: Number(data.estimatedProfit),
            parentId: row.id,
          });
          const newItem: RowData = {
            id: res.current.id,
            rowName: res.current.rowName,
            salary: res.current.salary,
            equipmentCosts: res.current.equipmentCosts,
            overheads: res.current.overheads,
            estimatedProfit: res.current.estimatedProfit,
            child: [],
          };
          handleAdd(newItem, row.id);
          onUpdate(res.current, res.changed);
          setIsVisibleNewItem(false);
        } catch (error) {
          console.error('Ошибка при создании строки:', error);
          setError('Не удалось создать строку. Пожалуйста, попробуйте снова.');
        } finally {
          setIsLoading(false);
          setIsBlocked(false);
        }
      },
      [handleAdd, onUpdate, row.id]
    );

    const updateRowData = useCallback(
      async (data: FormData) => {
        setIsLoading(true);
        setError(null);
        setIsBlocked(true);
        try {
          const res = await updateRow({
            id: row.id,
            rowName: data.rowName,
            salary: Number(data.salary),
            equipmentCosts: Number(data.equipmentCosts),
            overheads: Number(data.overheads),
            estimatedProfit: Number(data.estimatedProfit),
          });
          onUpdate(res.current, res.changed);
          setIsEditing(false);
        } catch (error) {
          console.error('Ошибка при обновлении строки:', error);
          setError('Не удалось обновить строку. Пожалуйста, попробуйте снова.');
        } finally {
          setIsLoading(false);
          setIsBlocked(false);
        }
      },
      [onUpdate, row.id]
    );

    const deleteRowData = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await deleteRow(row.id);
        onUpdate(res.current, res.changed);
        handleDelete(res.current, [row]);
      } catch (error) {
        console.error('Ошибка при удалении строки:', error);
        setError('Не удалось удалить строку. Пожалуйста, попробуйте снова.');
      } finally {
        setIsLoading(false);
      }
    }, [handleDelete, onUpdate, row.id]);

    // Обработчик нажатия клавиш
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          if (isEditing) {
            exitEditMode();
          } else if (isVisibleNewItem) {
            exitAddMode();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isEditing, isVisibleNewItem, exitEditMode, exitAddMode]);

    // Функция для отрисовки дерева
    const countAllChildren = useCallback(
      (row: RowData, isTopLevel: boolean = true): number => {
        let totalCount = row.child.length;
        for (let i = 0; i < row.child.length; i++) {
          const child = row.child[i];
          if (
            i === row.child.length - 1 &&
            row.child.length > 1 &&
            isTopLevel
          ) {
            totalCount += 0;
          } else {
            totalCount += countAllChildren(child, false);
          }
        }
        return totalCount;
      },
      []
    );

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <>
        <form onSubmit={handleSubmit(updateRowData)}>
          <div className="table-content-wrapper" onDoubleClick={toggleEdit}>
            {row.child.length === 1 ? (
              <div
                className="tree-line"
                style={{
                  left: `${pl + 14}px`,
                  height:
                    row.child.length * 53 +
                    (row.child.length > 1 ? 7 * (row.child.length - 1) : 0),
                }}
              />
            ) : (
              <div
                className="tree-line"
                style={{
                  left: `${pl + 14}px`,
                  height:
                    countAllChildren(row) * 53 +
                    (countAllChildren(row) > 1
                      ? 7 * (countAllChildren(row) - 1)
                      : 0),
                }}
              />
            )}
            <ul className="table-content-list-1">
              <li className="table-content-1-item" style={{ paddingLeft: pl }}>
                <div
                  className={`table-content-icon-wrapper ${
                    isHovered ? 'hovered' : ''
                  }`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div
                    className="tree-line-horizontal"
                    style={{
                      display: pl === 10 ? 'none' : 'block',
                    }}
                  ></div>
                  <img
                    onClick={openNewForm}
                    src={add}
                    alt="add"
                    className="table-content-icon-add"
                    style={{
                      pointerEvents: isBlocked ? 'none' : 'auto',
                      opacity: isBlocked ? 0.5 : 1,
                    }}
                  />
                  {isHovered && (
                    <img
                      onClick={deleteRowData}
                      src={del}
                      alt="del"
                      className="table-content-icon-delete"
                      style={{
                        pointerEvents: isBlocked ? 'none' : 'auto',
                        opacity: isBlocked ? 0.5 : 1,
                      }}
                    />
                  )}
                </div>
              </li>
              {isEditing ? (
                <li className="table-content-1-input">
                  <input
                    className={`${
                      errors.rowName ? 'error' : ''
                    } table-content-input`}
                    {...register('rowName', { required: true })}
                    type="text"
                  />
                </li>
              ) : (
                <li className="table-content-1-item">{row.rowName}</li>
              )}
            </ul>
            {isEditing ? (
              <ul className="table-content-list-2">
                <li className="table-content-2-input">
                  <input
                    {...register('salary', {
                      required: true,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Введите только числа',
                      },
                    })}
                    type="text"
                    className={`${
                      errors.salary ? 'error' : ''
                    } table-content-input`}
                  />
                </li>
                <li className="table-content-2-input">
                  <input
                    {...register('equipmentCosts', {
                      required: true,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Введите только числа',
                      },
                    })}
                    type="text"
                    className={`${
                      errors.equipmentCosts ? 'error' : ''
                    } table-content-input`}
                  />
                </li>
                <li className="table-content-2-input">
                  <input
                    {...register('overheads', {
                      required: true,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Введите только числа',
                      },
                    })}
                    type="text"
                    className={`${
                      errors.overheads ? 'error' : ''
                    } table-content-input`}
                  />
                </li>
                <li className="table-content-2-input">
                  <input
                    {...register('estimatedProfit', {
                      required: true,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Введите только числа',
                      },
                    })}
                    type="text"
                    className={`${
                      errors.estimatedProfit ? 'error' : ''
                    } table-content-input`}
                  />
                </li>
              </ul>
            ) : (
              <TableItemList row={row} />
            )}
          </div>
          <input style={{ display: 'none' }} type="submit" />
        </form>
        {row.child.map((item) => (
          <TableItem
            key={item.id}
            row={item}
            handleAdd={handleAdd}
            onUpdate={onUpdate}
            handleDelete={handleDelete}
            pl={pl + 20}
          />
        ))}
        {isVisibleNewItem && (
          <TableNewItem
            pl={pl + 10}
            onSubmit={(data) => {
              addRowData(data);
              closeNewForm();
            }}
          />
        )}
      </>
    );
  }
);
export default TableItem;
