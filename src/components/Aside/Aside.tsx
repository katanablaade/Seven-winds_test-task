import './Aside.style.scss';
import asideIcon from '../../assets/aside-icon.png';
import arrowDown from '../../assets/arrow-down.png';

const links = [
  { id: 1, name: 'По проекту' },
  { id: 2, name: 'Объекты' },
  { id: 3, name: 'РД' },
  { id: 4, name: 'МТО' },
  { id: 5, name: 'СМР' },
  { id: 6, name: 'График' },
  { id: 7, name: 'МиМ' },
  { id: 8, name: 'Рабочие' },
  { id: 9, name: 'Капвложения' },
  { id: 10, name: 'Бюджет' },
  { id: 11, name: 'Финансирование' },
  { id: 12, name: 'Панорамы' },
  { id: 13, name: 'Камеры' },
  { id: 14, name: 'Поручения' },
  { id: 15, name: 'Контрагенты' },
];

export function Aside() {
  return (
    <div className="aside">
      <div className="aside-titles-project">
        <div className="aside-titles-project-wrapper">
          <p className="aside-titles-project-name">Название проекта</p>
          <p className="aside-titles-project-abbreviation">Аббревиатура</p>
        </div>
        <img className="aside-titles-project-img" src={arrowDown} alt="" />
      </div>
      <div className="separator" />
      <div className="aside-wrapper">
        <ul className="aside-list">
          {links.map((item) => {
            return (
              <li key={item.id} className="aside-item">
                <img className="aside-item-icon" src={asideIcon} alt="" />
                <p className="aside-item-name"> {item.name}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
