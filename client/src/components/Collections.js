import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Form } from 'react-bootstrap';
import theme from '../logo/theme.svg';
import { useTheme } from './ThemeContext';

const Collections = () => {
  const { darkMode, toggleDarkMode} = useTheme();
  const [collections, setCollections] = useState([]);
  const location = useLocation();

  const isGuest = location?.state?.isGuest;
  // const isAdmin = location?.state?.isAdmin;
  // const usersId = location?.state?.usersId;

  useEffect(() => {
    if (isGuest) {
      const getCollections = async () => {
        try {
          const resp = await axios.get('http://localhost:3030/collections');
          setCollections(resp.data)
        } catch (e) {
          console.error(e)
        }
      }
      getCollections()
    }
  })
 
  return (
    <div className='d-flex flex-column align-items-center'>
      <header className={`header ${darkMode ? 'header-dark' : 'header-light'}`}>
          <h5 className="text-center createColl">Create your collections!</h5>
          <div className="themes">
            <img className={`${darkMode ? 'logo-themes-dark' : ''}`} src={theme} alt="mode"/>
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
      <div className={`collections-wrapper d-flex justify-content-center ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className='wrap'>
          <div className="coll">
            {collections.map((el) => (
              <div className={`card shadow-lg ${darkMode ? 'inner-dark' : 'light-theme'}`} key={el.id}>
                <ul>
                  <li><a className={`${darkMode ? 'create-dark' : 'create-light'}`} href='!#'>{el.name}</a></li>
                  <li className={`${darkMode ? 'li-dark' : 'li-light'}`}>{el.description}</li>
                  <li className={`${darkMode ? 'li-dark' : 'li-light'}`}>{el.topic}</li>
                </ul>
              </div>
            ))}
          </div>
        </div> 
      </div>
  </div>
)
}

export default Collections;