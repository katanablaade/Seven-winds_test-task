import './AppHeader.style.scss';
import burger from '../../assets/burger-icon.png';
import arrow from '../../assets/arrow.png';

export function AppHeader() {
  return (
    <div className="header">
      <div className="container">
        <div className="header-panel">
          <a href="$" className="header-panel-burger">
            <img
              className="header-panel-burger-img"
              src={burger}
              alt="burger-icon"
            />
          </a>
          <a href="$" className="header-panel-arrow">
            <img className="header-panel-arrow-img" src={arrow} alt="" />
          </a>

          <ul className="header-panel-list">
            <li className="header-panel-item">Просмотр</li>
            <li className="header-panel-item">Управление</li>
          </ul>
        </div>
      </div>

      <div className="separator" />
      <div className="header-titles">
        <div className="header-titles-wrapper">
          <div className="header-titles-name">Строительно-монтажные работы</div>
        </div>
      </div>
    </div>
  );
}
