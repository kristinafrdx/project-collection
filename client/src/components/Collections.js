import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useTheme } from './context/ThemeContext';
import Header from './Header';
import { useTranslation } from 'react-i18next';
import { useUser } from '../components/context/UserContext';
import { useAuth } from "../components/context/IsloggedContext";
import likeLogo from '../logo/like.svg';
import likeFill from '../logo/likeFill.svg';

const host = 'http://localhost:3030';

const Collections = () => {
  const { t } = useTranslation();
  const { isLogged } = useAuth();
  const { darkMode } = useTheme();
  const { userRole, setUserId, userId } = useUser();

  const [collections, setCollections] = useState([]);
  const [guest, setGuest ] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [, setUser] = useState(false);
  const [items, setLastItems] = useState([]);
  const [selectedColl, setSelectedColl] = useState(null)
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [likesSt, setLikes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === 'guest') {
      setGuest(true);
      setUserId(null);
    } else if (userRole === 'admin') {
      setAdmin(true);
      setUser(true);
    } else {
      setUser(true);
    }
  }, [userRole, userId, setUserId]);

  useEffect(() => {
    const getCollections = async () => {
      await axios.get(`${host}/collections`)
      .then((resp) => {
        const largest = resp.data.largest;
        const likes = resp.data.likes;
        const likeIdCurrentUser = likes.filter((el) => Number(el.idUser) === Number(userId));
        const idC = likeIdCurrentUser.map((el) => el.idCollection);
        const lastItems = resp.data.last;
        setLastItems([...lastItems]);
        setLikes((prev) => [...prev, ...idC]);
        setCollections(largest);
      })
      .catch((e) => {
        console.log(e);
      });
    };
    getCollections();
  }, [userId]);
 
  const handleCard = (e, id) => {
    if (admin) {
      setCheckboxChecked(!checkboxChecked);
      setSelectedColl(Number(id));
    }
  };

  const handleReset = (e) => {
    const elem = e.target.closest('.card');
    if (!elem) {
      setSelectedColl(null);
    }
  };
 
  const deleteColl = async (id) => {
    await axios.post(`${host}/deleteColl`, { id })
    .then((resp) => {
      setCollections(resp.data.updateColl);
    })
    .catch((e) => {
      console.log(`Error removing: ${e}`)
    })
  };

  const handleLike = (e, idUser, idColl) => {
    e.stopPropagation();
    const fetchLikes = async (like) => {
      await axios.post(`${host}/like`, { idU: idUser, idC: idColl, like })
      .then((resp) => {
        const newColl = resp.data.updateLargest;
      setCollections(newColl);
      })
      .catch((e) => {
        console.log(e);
      });
    };
    if (likesSt.includes(idColl)) {
      setLikes(likesSt.filter(item => item !== idColl));
      fetchLikes(false);
    } else {
      setLikes([...likesSt, idColl]);
      fetchLikes(true);
    }
  };
  
  return (
    <div className='d-flex flex-column align-items-end'>
      <Header showRegistration={guest} showExit={isLogged} app={admin} path={'/admin'}/>
        <div className={`wrap ${darkMode ? 'dark-theme' : '' }`} onClick={(e) => handleReset(e)}>
          { !guest ? (
            <div className='link'>
              <div className='d-flex flex-column align-items-center'>
                <div className='links'>
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
                  <button 
                    type="button" 
                    className={`pb-2 linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} 
                    onClick={() => navigate('/allColl')}
                  >
                    {t('collections.all')}
                  </button>
                  { selectedColl ? (
                    <button 
                      type='button' 
                      className={`pb-2 linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} 
                      onClick={(e) => deleteColl(selectedColl)}
                    >
                      {t("collections.delete")}
                    </button>
                  ) : null }
                </div>

                <div className='items-cont'>
                  <h5 
                    className={`${darkMode ? 'lastItems-dark-text' : 'lastItems-light-text'}`} 
                    style={{textAlign: 'center', fontWeight: '300', marginBottom: '10px'}}
                  >
                    {t('collections.last')}
                  </h5>
                  { items.length > 0 ? (
                    <div className='items'>
                      { items.map((el) => (
                        <ul 
                          key={el.id} 
                          className={`ulItems ${darkMode ? 'lastItems-dark' : 'lastItems-light'} p-1`} 
                          style={{marginBottom:'10px'}}
                        >
                          <li>{t('page.name')} {el.name}</li>
                          { el.tag ? (
                            <li>{t('page.tags')}: {el.tag}</li>
                          ) : null }
                          <li>{t('collections.collection')}{el.idCollection}</li>
                          <li>{t('collections.createdBy')} {el.createdBy}</li>
                          <li>{t('collections.date')} {new Date(el.date).toLocaleString()}</li>
                        </ul>
                      ))}
                    </div>
                  ) : 
                    (<p>{t('page.notFound')}</p>)}
                </div>
              </div>
            </div>
          ) : null}
          <div className='items-wrap' style={{paddingTop: '30px'}}>
            <h5 className='largestText' style={{paddingBottom: '20px'}}>
              {t('collections.largest')}
            </h5>
            <div className="coll pt-0" style={{marginLeft: '0'}}>
              { collections && collections.length > 0 ? (
                collections.map((el) => (
                  <div key={el.id}>
                    <div 
                      className={`card align-items-start shadow-lg ${darkMode ? 'inner-dark linkButton-dark' : 'linkButton-light light-theme'}`} 
                      style={{width: '200px', height: '200px'}} 
                      id={el.id} 
                      onClick={(e) => handleCard(e, el.id)}
                    >
                      { el.linkToImage ? (
                        <img style={{width: '200px', height: '200px'}} src={el.linkToImage} alt='img' />
                      ) : null} 
                      <div 
                        className='d-flex justify-content-end' 
                        style={{width: '100%', padding: '10px', position:'absolute', height: '100%'}} 
                      >
                        <div className='d-flex flex-column justify-content-between'>
                        { userRole === 'admin' ? (
                          <div className='d-flex justify-content-end'>
                            <label htmlFor={el.id}></label>
                            <input 
                              className={'checkbox'} 
                              type="radio" 
                              checked={selectedColl === el.id} 
                              onChange={() => setSelectedColl(el.id)}
                              id={el.id}
                            />
                          </div>
                        ) : null }
                        </div>
                      </div>
                    </div>
                    <ul className='d-flex justify-content-between' id={el.id}>
                      <li className='nameColl' onClick={() => navigate('/page', { state: { id: el.id }})}>{el.name}</li>
                      <li> 
                        { userRole !== 'guest' ? (
                          <div className='containerLikes d-flex align-items-baseline'>
                            <button className='linkButton d-flex' type="button" onClick={(e) => handleLike(e, userId, el.id)}>
                            { likesSt.includes(el.id) ? (
                              <div>
                                <img id={el.id} src={likeFill} alt='likefill' className={`${darkMode ? 'logo-done-dark': ''}`} />
                              </div>
                            ) : (
                              <div>
                                <img id={el.id} src={likeLogo} alt='like' className={`${darkMode ? 'logo-done-dark': ''}`} ></img> 
                              </div>
                            )}
                            </button>
                            <h5 style={{fontSize: '12px'}}>
                              {el.likes}
                            </h5>
                          </div>
                        ) : null}</li>
                    </ul>
                  </div>
                ))
              ) : null }
            </div>
          </div>
        </div>
    </div>
  )
};

export default Collections;
