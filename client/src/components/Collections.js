import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from './context/ThemeContext';
import Header from './Header';
import { useTranslation } from 'react-i18next';

const Collections = () => {
  const { darkMode } = useTheme();
  const [collections, setCollections] = useState([]);
  const location = useLocation();
  const [ setGuest ] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [user, setUser] = useState(false);
  const { t } = useTranslation();

  const isGuest = location?.state?.isGuest;
  const isAdmin = location?.state?.isAdmin;

  useEffect(() => {
    const getCollections = async () => {
      try {
        const resp = await axios.get('http://localhost:3030/collections');
        const allColl = resp.data.collections;
        setCollections(allColl);
      } catch (e) {
        console.error(e)
      }
    }
    getCollections();
    
    if (isGuest) {
      setGuest(true);
    } else if (isAdmin) {
      setAdmin(true);
      setUser(true)
    } else {
      setUser(true);
    }
  }, [isAdmin, isGuest, setGuest])

  const navigate = useNavigate();

  return (
    <div className='d-flex flex-column align-items-end'>
      <Header showRegistration={isGuest} showExit={user}/>
        <div className={`wrap ${darkMode ? 'dark-theme' : '' }`}>
          {admin || user ? (
            <div className='link'>
              <button type="button" className={`pb-2 linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`}>
                {t("collections.create")}
              </button>
              <button type="button" className={`linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} onClick={() => navigate('/mycollections')}>
                {t("collections.my")}
              </button>
            </div>
          ): null}
          <div className="coll">
            {collections ? (
              collections.map((el) => (
                <div className={`card shadow-lg ${darkMode ? 'inner-dark linkButton-dark' : 'linkButton-light light-theme'}`} onClick={() => alert('collection')} key={el.id}>
                  <ul className='text-coll'>
                    <li className='nameColl'>{el.name}</li>
                    <div><li className={`${darkMode ? 'li-dark' : 'li-light'}`}>{el.description}</li>
                    <li className={`${darkMode ? 'li-dark' : 'li-light'}`}>{el.topic}</li></div>
                  </ul>
                </div>
              ))
            ) : null}
          </div>
        </div>
    </div>
)
}

export default Collections;