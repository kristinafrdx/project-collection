import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useTheme } from "./context/ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "./context/UserContext";
import { useTranslation} from "react-i18next";

const MyCollections = () => {
  const { darkMode } = useTheme();
  const { userId } = useUser();
  const navigate = useNavigate();
  const [myColl, setMyColl] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const getCollections = async () => {
      try {
        const resp = await axios.post('http://localhost:3030/mycollections', { userId });
        setMyColl(resp.data.getMy);
      } catch (e) {
        console.error(e)
      }
    }
    getCollections();
  }, [userId])

  return (
    <div className='d-flex flex-column align-items-end'>
      <Header showExit={true}/>
        <div className={`wrap ${myColl.length < 1 ? 'coll-height' : ''} ${darkMode ? 'dark-theme' : '' }`}>
            <div className='link'>
              <button type="button" className={`pb-2 linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`}>
              {t("collections.create")}
              </button>
              <button type="button" className={`linkButton ${darkMode ? 'linkButton-dark' : 'linkButton-light' }`} onClick={() => navigate('/collections')}>
              {t("registration.back")}
              </button>
            </div>
          <div className={`coll`}>
            {myColl && myColl.length > 0? (
              myColl.map((el) => (
                <div className={`card shadow-lg ${darkMode ? 'inner-dark linkButton-dark' : 'linkButton-light light-theme'}`} onClick={() => alert('collection')} key={el.id}>
                  <ul className='text-coll'>
                    <li className='nameColl'>{el.name}</li>
                    <div><li className={`${darkMode ? 'li-dark' : 'li-light'}`}>{el.description}</li>
                    <li className={`${darkMode ? 'li-dark' : 'li-light'}`}>{el.topic}</li></div>
                  </ul>
                </div>
              ))
            ) : (
              <h5 className={`${darkMode ? 'empty-coll-dark' : 'empty-coll-light'}`}>{t('collections.empty')}</h5>
            )}
          </div>
        </div>
    </div>
  )
}

export default MyCollections;
