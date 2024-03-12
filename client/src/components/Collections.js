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
  const [, setGuest ] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [user, setUser] = useState(false);
  const { t } = useTranslation();
  const [selectedColl, setSelectedColl] = useState(null)
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [showDeleteButton, setShowDelete] = useState(false);

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

  const handleCard = (id) => {
    if (selectedColl === id) {
      setSelectedColl(null);
      setCheckboxChecked(false)
      setShowDelete(false)
    } else {
      setCheckboxChecked(!checkboxChecked);
      setSelectedColl(Number(id));
      setShowDelete(true)
    }
  }

  const handleReset = (e) => {
    const elem = e.target.closest('.card');
    if (!elem && e.target.tagName !== 'BUTTON') {
      setSelectedColl(null)
      setShowDelete(false)
    } 
  }
 
  const deleteColl = async (id) => {
    const resp = await axios.post('http://localhost:3030/deleteColl', { id })
    console.log(resp.data)
    setCollections(resp.data.updateColl)
    setShowDelete(false);
  }

  return (
    <div className='d-flex flex-column align-items-end'>
      <Header showRegistration={isGuest} showExit={user}/>
        <div className={`wrap ${darkMode ? 'dark-theme' : '' }`} onClick={(e) => handleReset(e)}>
          {admin || user ? (
            <div className='link'>
              <button type="button" className={`pb-2 linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} onClick={() => navigate('/createColl')}>
                {t("collections.create")}
              </button>
              <button type="button" className={`pb-2 linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} onClick={() => navigate('/mycollections')}>
                {t("collections.my")}
              </button>
              {showDeleteButton ? (
                <button type='button' className={`linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} onClick={(e) => deleteColl(selectedColl)}>
                 {t("collections.delete")}
                </button>
              ) : null}
            </div>
          ): null}
          <div className="coll">

            {collections ? (
              collections.map((el) => (
                <div className={`card shadow-lg ${darkMode ? 'inner-dark linkButton-dark' : 'linkButton-light light-theme'}`} id={el.id} key={el.id} onClick={() => handleCard(el.id)}>
                  <ul className='text-coll' id={el.id}>
                    <li className='nameColl'>{el.name}</li>
                    <div id={el.id}><li id={el.id} className={`${darkMode ? 'li-dark' : 'li-light'}`}>{el.description}</li>
                    <li id={el.id} className={`${darkMode ? 'li-dark' : 'li-light'}`}>{el.topic}</li></div>
                  </ul>
                  <div className='d-flex justify-content-end' style={{width: '100%', padding: '10px'}} id={el.id}>
                    <label htmlFor={el.id}></label>
                    <input className={'checkbox'} id={el.id} type="radio" checked={selectedColl === el.id} onChange={() => handleCard(el.id)}/>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>
    </div>
)
}

export default Collections;
