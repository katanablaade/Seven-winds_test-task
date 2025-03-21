import { useForm } from 'react-hook-form';
import { FormData } from 'src/types';
import { useGlobal } from '../GlobalContext/GlobalContext';

import './TableNewItem.style.scss';
import add from '../../assets/add.png';
import del from '../../assets/delete.png';

interface TableNewItemProps {
  pl?: number;
  onSubmit: (data: FormData) => void;
  values?: FormData;
}

export function TableNewItem({
  pl = 0,
  onSubmit,
  values = {
    rowName: '',
    salary: '0',
    equipmentCosts: '0',
    overheads: '0',
    estimatedProfit: '0',
  },
}: TableNewItemProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      ...values,
    },
  });
  const { isHovered, setIsHovered, isBlocked } = useGlobal();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="table-content-wrapper">
        <ul className="table-content-list-1 ">
          <li className="table-content-1-input" style={{ paddingLeft: pl }}>
            <div
              className={`table-content-icon-wrapper ${
                isHovered ? 'hovered' : ''
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
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
          <li className="table-content-1-input">
            <input
              className={`${errors.rowName ? 'error' : ''} table-content-input`}
              {...register('rowName', { required: true })}
              type="text"
            />
          </li>
        </ul>
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
              className={`${errors.salary ? 'error' : ''} table-content-input`}
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
      </div>
      <input style={{ display: 'none' }} type="submit" />
    </form>
  );
}
