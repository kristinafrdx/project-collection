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
  const { userRole, userId } = useUser();
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const [field1, setField1] = useState(null);
  const [field2, setField2] = useState(null);
  const [field3, setField3] = useState(null);
  
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

  
  const deleteItem = async (id) => {
    try {
      const resp = await axios.post('http://localhost:3030/deleteItem', { id, idC: idColl });
      const updateItems = resp.data.idColl;
      setItems(updateItems)
    } catch (e) {
      console.log(e)
    }
  }

  
  const handleReset = (e) => {
    const elem = e.target.closest('.card');
    if (!elem && e.target.tagName !== 'BUTTON') {
      setSelectedItem(null)
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
          const fiel1 = collection.field1;
          const fiel2 = collection.field2;
          const fiel3 = collection.field3;
          setCategory(collection.topic);
          setNameColl(collection.name);
          setDescr(collection.description);
          if (fiel1) {
            setField1(fiel1)
          } 
          if (fiel2) {
            setField2(fiel2);
          }
          if (fiel3) {
            setField3(fiel3);
          }
          setItems(prev => [...prev, ...items])

          if (collection.createdBy === userId) {
            setShowButtons(true)
          }
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
    if (selectedItem === id) {
      setSelectedItem(null);
      setCheckboxChecked(false)
      setShowDelete(false)
    } else {
      if (!guest) {
        setCheckboxChecked(!checkboxChecked);
        setSelectedItem(Number(id));
        setShowDelete(true)
      }
    }
  }

  const handleAdd = async () => {
    navigate('/addItem', 
    { 
      state: { 
        id, 
        fields: {
           field1, 
           field2, 
           field3 
        }  
      }
    })
  }

    return (
    <div>
      <Header showExit={admin || user} showRegistration={guest}/>
      <div className={`${darkMode ? 'dark-theme' : ''}`} style={{padding: '20px 20px 0', minHeight: '100vh' }} onClick={(e) => handleReset(e)}>
        <div className="d-flex justify-content-end">
          <div className="cont_for_button d-flex justify-content-around align-items-start" style={{justifyContent: 'space-between', gap: '50px'}}>
            {showButtons || admin ? (
            <div className="add/edit/delete d-flex" style={{gap: '50px'}}>
              {showDeleteButton ? (
              <div className="d-flex" style={{gap: '50px'}}>
                <button type="button" className={`linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`}>
                  {t('page.edit')}
                </button>
                <button type='button' className={`linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} onClick={(e) => deleteItem(selectedItem)}>
                  {t("collections.delete")}
                </button>
                </div>
                ) : null}
              {guest ? null : (
                <button type="button" className={`linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} onClick={handleAdd}>
                {t('page.add')}
              </button>
              )}
            </div>
              ): null}
            <div className="back" style={{paddingLeft: '10px'}}>
              <button type="button" className={`linkButton pb-2 ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} onClick={() => navigate('/collections')}>
                {t("registration.back")}
              </button>
            </div>
          </div>
        </div>

        <div className={`d-flex flex-wrap ${itemsSt && itemsSt.length > 0 ? 'haveItems' : 'haventItems'}`} style={{gap: '20px'}}>
          <div className="leftSide" style={{maxWidth: '35%'}}>
            <div className="cont_For_Collection">
              <div style={{padding: '0', margin: '0', alignItems: 'start'}}>
                <h3 style={{overflowWrap: 'anywhere'}}>{nameColl}</h3>
                <h4 style={{overflowWrap: 'anywhere'}}>{category}</h4>
                <h4>{field1}</h4>
                <h4>{field2}</h4>
                <h4>{field3}</h4>
                <div style={{overflowWrap: 'anywhere', marginBottom: '0.5rem'}}>
                  <h4>{descr}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="items">
            <div className={`d-flex flex-wrap`} style={{gap: '30px'}}>
              {loading ? null : (
                itemsSt && itemsSt.length > 0 ? (
                  itemsSt.map((el) => (
                    <div key={el.id} className={`${darkMode ? 'inner-dark' : 'light-theme'} card`} onClick={() => handleCard(el.id)} style={{justifyContent: 'space-between'}}>
                      <ul key={el.id}>
                        <li>{el.name}</li>
                        <li>{el.tag}</li>
                      </ul>
                      {showButtons || admin ? (
                        <div id={el.id} className='d-flex justify-content-end' style={{width: '100%', padding: '10px'}}>
                          <label htmlFor={el.id}></label>
                          <input className={'checkbox'} id={el.id} type="radio" checked={selectedItem === el.id} onChange={() => handleCard(el.id)}/>
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                <div>
                  <h2>{t('page.notFound')}</h2>
                  { admin || (!guest && showButtons) ? (
                    <button type="button" onClick={handleAdd} className={`linkButton pb-2 ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} style={{fontSize: '18px'}}>
                      {t('page.addItem')}
                    </button>
                  ): null}
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
