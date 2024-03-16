import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "./context/UserContext";
import { useTranslation} from "react-i18next";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

const PageCollection = () => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const { userRole } = useUser();
  const location = useLocation();

  const [guest, setGuest ] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [user, setUser] = useState(false);
  const [idColl, setIdColl] = useState(null);
  const [nameColl, setNameColl] = useState('');
  const [descr, setDescr] = useState('');
  const [category, setCategory] = useState('');
  const [itemsSt, setItems] = useState([]);
  const [showDeleteButton, setShowDelete] = useState(false);
  const [selectedColl, setSelectedColl] = useState(null);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  const id = location?.state?.id

  useEffect(() => {
    setIdColl(id)
  }, [idColl, id])

  useEffect(() => {
    if (userRole === 'guest') {
      setGuest(true);
    } else if (userRole === 'admin') {
      setAdmin(true);
    } else {
      setUser(true);
    }
  }, [userRole])

  
  const deleteColl = async (id) => {
    // const resp = await axios.post('http://localhost:3030/deleteColl', { id })
    // console.log(resp.data)
    // setMyColl(resp.data.updateColl)
    // setShowDelete(false);
  }

  const handleReset = (e) => {
    const elem = e.target.closest('.card');
    if (!elem && e.target.tagName !== 'BUTTON') {
      setSelectedColl(null)
      setShowDelete(false)
    } 
  }

  useEffect(() => {
    const getCollections = async () => {
      try {
        if (idColl !== null) {
          const resp = await axios.post('http://localhost:3030/getcollection', { idColl });
          const items = resp.data.items;
          const collection = resp.data.collection[0];
          setCategory(collection.topic);
          setNameColl(collection.name);
          setDescr(collection.description);
          setItems(items)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
   getCollections(idColl)
  }, [idColl])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  const handleCard = (id) => {
    if (selectedColl === id) {
      setSelectedColl(null);
      setCheckboxChecked(false)
      setShowDelete(false)
    } else {
      if (!guest) {
        setCheckboxChecked(!checkboxChecked);
        setSelectedColl(Number(id));
        setShowDelete(true)
      }
    }
  }

  return (
    <div>
      <Header showExit={admin || user} showRegistration={guest}/>
      <div className={`${darkMode ? 'dark-theme' : ''}`} style={{padding: '20px 20px 0', minHeight: '100vh' }} onClick={(e) => handleReset(e)}>
        <div className="d-flex justify-content-end">
          <div className="cont_for_button d-flex justify-content-around align-items-start" style={{justifyContent: 'space-between', gap: '50px'}}>
            <div className="add/edit/delete d-flex" style={{gap: '50px'}}>
              { showDeleteButton ? (
                <div className="d-flex" style={{gap: '50px'}}>
                  <button type="button" className={`linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`}>
                    Edit
                  </button>
                  <button type='button' className={`linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} onClick={(e) => deleteColl(selectedColl)}>
                    {t("collections.delete")}
                  </button>
                </div>
              ) : null}
              { guest ? null : (
                <button type="button" className={`linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`}>
                  Add
                </button>)}
            </div>
            <div className="back" style={{paddingLeft: '10px'}}>
              <button type="button" className={`linkButton pb-2 ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} onClick={() => navigate('/collections')}>
                {t("registration.back")}
              </button>
            </div>
          </div>
        </div>

        <div className={`d-flex flex-wrap ${itemsSt.length > 0 ? 'haveItems' : 'haventItems'}`} style={{gap: '20px'}}>
          <div className="leftSide" style={{maxWidth: '35%'}}>
            <div className="cont_For_Collection">
              <div style={{padding: '0', margin: '0', alignItems: 'start'}}>
                <h3 style={{overflowWrap: 'anywhere'}}>{nameColl}</h3>
                <h4 style={{overflowWrap: 'anywhere'}}>{category}</h4>
                <div style={{overflowWrap: 'anywhere', marginBottom: '0.5rem'}}>
                  <h4>{descr}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="items">
            <div className={`d-flex flex-wrap`} style={{gap: '30px'}}>
              {loading ? null : (
                itemsSt.length > 0 ? (
                  itemsSt.map((el) => (
                    <div key={el.id} className={`${darkMode ? 'inner-dark' : 'light-theme'} card`} onClick={() => handleCard(el.id)} style={{justifyContent: 'space-between'}}>
                      <ul>
                        <li>{el.name}</li>
                        <li>{el.tag}</li>
                      </ul>
                      {guest ? null : (
                        <div id={el.id} className='d-flex justify-content-end' style={{width: '100%', padding: '10px'}}>
                          <label htmlFor={el.id}></label>
                          <input className={'checkbox'} id={el.id} type="radio" checked={selectedColl === el.id} onChange={() => handleCard(el.id)}/>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                <div>
                  <h2>Items didn't found.</h2>
                  { guest ? null : (
                    <button type="button" className={`linkButton pb-2 ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} style={{fontSize: '18px'}}>
                      Add item
                    </button>
                  )}
                </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
  </div>
  )
}

export default PageCollection;
