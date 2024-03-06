import { all } from 'axios';
import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import { Form } from 'react-bootstrap';
import theme from '../logo/theme.svg';
import { useTheme } from './ThemeContext';

const Collections = () => {
  const { darkMode, toggleDarkMode} = useTheme();
  // const location = useLocation();

  // const allCollections = location?.state || [];
  // console.log(allCollections);
 
  return (
  <div className="d-flex flex-column">
      <header className={`header ${darkMode ? 'header-dark' : 'header-light'}`}>
        <h5 className="text-center createColl">Create your collections!</h5>
        <div className="themes">
          <img className={`${darkMode ? 'logo-themes-dark' : 'light-theme'}`} src={theme} alt="mode"/>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
          </Form>
        </div>
      </header>
  </div>
)
}

export default Collections;