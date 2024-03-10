import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "./context/ThemeContext";
import theme from '../logo/theme.svg';
import { Form } from 'react-bootstrap';
import { useLanguage } from "./context/LangContext";
import registration from "../logo/registration.svg";
import { useNavigate } from "react-router-dom";
import logout from "../logo/logout.svg"

const Header = ({ showRegistration, showExit }) => {
  const {t, i18n} = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage } = useLanguage();
  
  const navigation = useNavigate()
  const toggleChangeLanguage = (e) => {
    const selectedLg = e.target.value;
    i18n.changeLanguage(selectedLg);
    setLanguage(selectedLg);
  }

  return (
    <header className={`header m-0 ${darkMode ? 'header-dark' : 'header-light'}`}>
        <h5 className="text-center createColl">{t('header.createCollections')}</h5>
        <div className="themes">
          {showRegistration && (
            <div>
              <button type="button" className="linkButton" onClick={() => navigation('/registration')}>
                <img className="registration" src={registration} alt="registration"></img>
              </button>
            </div>
          )}
          {showExit && (
            <div>
              <button type="button" className="linkButton" onClick={() => navigation('/')}>
                <img className="logout" src={logout} alt="logout"></img>
              </button>
            </div>
          )}
          <img className={`logo-mode ${darkMode ? 'logo-themes-dark' : ''}`} src={theme} alt="mode"/>
          <Form className="form-mode">
            <Form.Check
              type="switch"
              id="custom-switch"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
          </Form>
          <select value={language} onChange={toggleChangeLanguage} className={`${darkMode ? 'select-dark' : 'select-light'}`}>
            <option value={'en'}>EN</option>
            <option value={'es'}>ES</option>
          </select>
        </div>
      </header>
  )
}

export default Header;