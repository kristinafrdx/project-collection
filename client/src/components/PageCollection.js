import React, { useState, useEffect, cloneElement } from "react";
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
  
  const [loading, setLoading] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const [field1, setField1] = useState(null);
  const [field2, setField2] = useState(null);
  const [field3, setField3] = useState(null);
  const [link, setLink] = useState(null)

  const [showDeleteButton, setShowDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
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
    const isInsideTable = e.target.closest('table');
    const isInsideRow = e.target.closest('tr');
    const isInsideCell = e.target.closest('td') || e.target.closest('th');
    if (!isInsideCell || !isInsideRow || !isInsideTable) {
      setSelectedItem(null);
      setCheckboxChecked(false);
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
          const linkToImage = collection.linkToImage;
          const fiel1 = collection.field1;
          const fiel2 = collection.field2;
          const fiel3 = collection.field3;
          setCategory(collection.topic);
          setNameColl(collection.name);
          setDescr(collection.description);
          setLink(linkToImage)
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
      setCheckboxChecked(!checkboxChecked);
      setSelectedItem(Number(id));
      setShowDelete(true)
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
        <div>
          <div className="leftSide mb-4" style={{paddingLeft: '30px'}}>
            <div className="cont_For_Collection">
              <div className="d-flex flex-wrap align-items-start" style={{padding: '0', margin: '0', alignItems: 'start'}}>
                { link ? (
                  <div style={{maxWidth: '100%'}}>
                  <img style={{maxWidth: '400px', width: '100%', margin: '0 auto 10px', paddingRight: '20px'}} src={link} alt='imageColl' />
                  </div>
                ) : null}
                <div className="d-flex flex-column" style={{paddingRight: '30px'}}>
                  <div style={{minWidth: '100px'}}>
                    <h3 style={{overflowWrap: 'anywhere'}}>
                      {t('page.name')}
                    </h3>
                    <p>{nameColl}</p>
                  </div>
                  {category ? (
                  <div>
                    <h4 style={{overflowWrap: 'anywhere'}}>
                      {t('page.category')}
                    </h4>
                    <p>{category}</p>
                  </div>) : null}
                </div>
                { descr ? (
                <div style={{overflowWrap: 'anywhere', marginBottom: '0.5rem', maxWidth: '80%'}}>
                  <h3>
                    {t('page.description')}
                  </h3>
                  <p>{descr}</p>
                </div>
                ) : null}
              </div>
            </div>
          </div>

          {loading ? null : (
            itemsSt && itemsSt.length > 0 ? (
              <div>
                <h2 style={{marginLeft: '30px', fontSize: '15px', textDecorationLine: 'underline'}}>
                  {t('page.yourItems')}
                </h2>   
                <div className="d-flex mt-3" style={{paddingBottom: '20px', overflow: 'hidden'}}>
                  <table style={{width: '90%'}}>
                    <thead>
                      <tr>
                        <th className="firstColumn"></th>
                        <th className={`${darkMode ? 'header-dark' : 'header-light'}`}style={{border: '1px solid black'}}>
                          №
                        </th>
                        <th className={`${darkMode ? 'header-dark' : 'header-light'}`} style={{border: '1px solid black'}}>
                          {t('page.name')}
                        </th>
                        <th className={`${darkMode ? 'header-dark' : 'header-light'}`} style={{border: '1px solid black'}}>
                          {t('page.tags')}
                        </th>
                        {field1 ? (<th className={`${darkMode ? 'header-dark' : 'header-light'}`} style={{border: '1px solid black'}}>{field1}</th>) : null}
                        {field2 ? (<th className={`${darkMode ? 'header-dark' : 'header-light'}`} style={{border: '1px solid black'}}>{field2}</th>) : null}
                        {field3 ? (<th className={`${darkMode ? 'header-dark' : 'header-light'}`} style={{border: '1px solid black'}}>{field3}</th>) : null}
                      </tr>
                    </thead>
                    <tbody>
                      {itemsSt.map((el, index) => (
                        <tr key={el.id} onClick={() => handleCard(el.id)}>
                          {showButtons || admin ? (
                            <td className={`${darkMode ? '' : 'light-theme'}`} style={{textAlign: 'end', width: '30px'}}>
                              <input className={`checkbox ${darkMode ? 'select-dark' : ''}`} id={el.id} type="radio" checked={selectedItem === el.id} onChange={() => handleCard(el.id)}/>
                              <label htmlFor={el.id}></label>
                            </td>
                          ) : <td></td>}
                          <td className={`${darkMode ? 'inner-dark' : 'light-theme'}`} style={{border: '1px solid black'}}>{index + 1}</td>
                          <td className={`${darkMode ? 'inner-dark' : 'light-theme'}`} style={{border: '1px solid black'}}>{el.name}</td>
                          <td className={`${darkMode ? 'inner-dark' : 'light-theme'}`} style={{border: '1px solid black'}}>{el.tag}</td>
                          {field1 ? (<td className={`${darkMode ? 'inner-dark' : 'light-theme'}`} style={{border: '1px solid black'}}>{el.field1}</td>) : null}
                          {field2 ? (<td className={`${darkMode ? 'inner-dark' : 'light-theme'}`} style={{border: '1px solid black'}}>{el.field2}</td>) : null}
                          {field3 ? (<td className={`${darkMode ? 'inner-dark' : 'light-theme'}`} style={{border: '1px solid black'}}>{el.field3}</td>)  : null}
                        </tr> 
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <h5 className={`${darkMode ? 'empty-coll-dark' : 'empty-coll-light'}`}>
                  {t('page.notFound')}
                </h5>
                <button type='button' className={`linkButton text-underline ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} onClick={handleAdd}>
                  {t('page.add')}
                </button>
              </div>
            )
          )}
        </div>
      </div>
  </div>
  )
}

export default PageCollection;
