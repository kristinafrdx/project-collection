import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useTheme } from './context/ThemeContext';
import Header from './Header';
import { useTranslation } from 'react-i18next';
import { useUser } from '../components/context/UserContext';
import { useAuth } from "../components/context/IsloggedContext";

const Collections = () => {
  const { t } = useTranslation();
  const { isLogged } = useAuth();
  const { darkMode } = useTheme();
  const { userRole, setUserId, userId } = useUser();

  const [collections, setCollections] = useState([]);
  const [guest, setGuest ] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [, setUser] = useState(false);
  
  const [selectedColl, setSelectedColl] = useState(null)
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [showDeleteButton, setShowDelete] = useState(false);

  useEffect(() => {
    if (userRole === 'guest') {
      setGuest(true);
      setUserId(null)
    } else if (userRole === 'admin') {
      setAdmin(true);
      setUser(true)
    } else {
      setUser(true);
    }
  }, [userRole, userId, setUserId])

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
  }, [])

  const navigate = useNavigate();

  const handleCard = (id) => {
    if (admin) {
      setShowDelete(true)
      if (selectedColl === id) {
        setSelectedColl(null);
        setCheckboxChecked(false)
      } else {
        setCheckboxChecked(!checkboxChecked);
        setSelectedColl(Number(id));
      }
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
    setCollections(resp.data.updateColl)
    setShowDelete(false);
  }

  return (
    <div className='d-flex flex-column align-items-end'>
      <Header showRegistration={guest} showExit={isLogged} app={admin} path={'/admin'}/>
        <div className={`wrap ${darkMode ? 'dark-theme' : '' }`} onClick={(e) => handleReset(e)}>
          {!guest ? (
            <div className='link'>
              <button 
                type="button" 
                className={`pb-2 linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} 
                onClick={() => navigate('/createColl')}
              >
                {t("collections.create")}
              </button>
              <button 
                type="button" 
                className={`pb-2 linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} 
                onClick={() => navigate('/mycollections')}
              >
                {t("collections.my")}
              </button>
              {admin ? (
                <button 
                  type='button' 
                  className={`linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} 
                  onClick={(e) => deleteColl(selectedColl)}
                >
                  {t("collections.delete")}
                </button>
              ): null}
            </div>
          ) : null}
          <div className="coll">
            { collections && collections.length > 0 ? (
              collections.map((el) => (
              <div key={el.id}>
              <div 
                className={`card shadow-lg ${darkMode ? 'inner-dark linkButton-dark' : 'linkButton-light light-theme'}`} 
                style={{width: '200px', height: '200px'}} 
                id={el.id} 
                onClick={() => handleCard(el.id)}
              >
                {el.linkToImage ? (<img style={{width: '200px', height: '200px'}} src={el.linkToImage} alt=''></img>) : null} 
                { userRole === 'admin' ? (
                  <div 
                    className='d-flex justify-content-end' 
                    style={{width: '100%', padding: '10px', position:'absolute'}} 
                  >
                    <label htmlFor={el.id}></label>
                    <input 
                      className={'checkbox'} 
                      type="radio" 
                      checked={selectedColl === el.id} 
                      onChange={() => handleCard(el.id)}
                    />
                  </div>
                ) : null }
              </div>
              <ul className='text-coll' id={el.id}>
                <li className='nameColl' onClick={() => navigate('/page', { state: { id: el.id }})}>{el.name}</li>
              </ul>
              </div>
              ))
            ) : null }
          </div>
        </div>
    </div>
)
}

export default Collections;
