import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import { WithContext as ReactTags } from 'react-tag-input';
import options from './tags';
import { useTheme } from './context/ThemeContext';
import { useTranslation } from 'react-i18next';

const host = 'http://localhost:3030';

const EditItem = () => {
  const [name, setName] = useState('');
  const [tags, setTags] = useState([]);
  const [field1Name, setField1Name] = useState('');
  const [field2Name, setField2Name] = useState('');
  const [field3Name, setField3Name] = useState('');
  const [field1Value, setField1Value] = useState('');
  const [field2Value, setField2Value] = useState('');
  const [field3Value, setField3Value] = useState('');
  const [err, setError] = useState(false);

  const { darkMode } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();

  const selected = location?.state?.selectedItem;
  const fields = location?.state?.fields;
  const navigate = useNavigate();

  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    setTags([...tags, tag]);
  };

  const suggestions = options.map((option) => {
    return {
      id: option,
      text: option,
    };
  });

  useEffect(() => {
    const fetchItem = async (id) => {
      await axios.post(`${host}/getItem`, { id })
      .then((resp) => {
        if (resp.data.item) {
          setName(resp.data.item.name);
          setTags(resp.data.item.tag.split(' ').map((tag) => ({ id: tag, text: tag })));
          setField1Value(resp.data.item.field1);
          setField2Value(resp.data.item.field2);
          setField3Value(resp.data.item.field3);
          setField1Name(fields.field1);
          setField2Name(fields.field2);
          setField3Name(fields.field3);
        } else {
          setError(true);
        }
      })
      .catch((e) => {
        console.log(`Error to get items: ${e}`)
      })
    };
    if (selected) {
      fetchItem(selected);
    }
  }, [fields.field1, fields.field2, fields.field3, selected]);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleSent = async (e) => {
    e.preventDefault();
    const fetchChange = async () => {
      const tagsValues = tags.map(el => el.text);
      await axios.post(`${host}/changeItem`, { selected, name, tagsValues, field1Value, field2Value, field3Value })
      .catch((e) => {
        console.log(`Error editing item: ${e}`)
      })
    };
    await fetchChange();
    navigate('/success');
  };

  const handlefield1 = (e) => {
    setField1Value(e.target.value);
  };

  const handlefield2 = (e) => {
    setField2Value(e.target.value);
  };

  const handlefield3 = (e) => {
    setField3Value(e.target.value);
  };

  return (
    <div className={`${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <Header />
      { !err ? (
        <div className={`rounded shadow-lg d-flex justify-content-center`} style={{minHeight: '100vh'}}>
          <form 
            className={`form-control mt-5 p-5 ${darkMode ? 'inner-dark inner-dark-edit' : 'light-theme'}`} 
            style={{maxWidth: '60%', height: 'fit-content'}}
          >
            <div className="d-flex flex-column mb-4">
              <label className="fw-bold mb-2">
                {t('page.name')}
              </label>
              <input defaultValue={name} onChange={handleName} className="form-control w-100 p-2" />
            </div>

            <label className="fw-bold mb-2">
              {t('page.tags')}
            </label>
            <ReactTags
              suggestions={suggestions}
              autofocus={false}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              inputFieldPosition="top"
              autocomplete={true}
              minQueryLength={3}
              tags={tags}
              placeholder={t('page.placeholder')}
              id="tags"
            />

            { field1Name ? (
              <div className="d-flex flex-column mb-4 mt-4">
                <label className="fw-bold mb-2">{field1Name}:</label>
                <input className={`form-control w-100 p-2`} defaultValue={field1Value} onChange={handlefield1} />
              </div>
            ) : null}

            { field2Name ? (
              <div className="d-flex flex-column mb-4">
                <label className="fw-bold mb-2">{field2Name}:</label>
                <input className={`form-control w-100 p-2`} defaultValue={field2Value} onChange={handlefield2} />
              </div>
            ) : null}

            { field3Name ? (
              <div className="d-flex flex-column mb-5">
                <label className="fw-bold mb-2">{field3Name}:</label>
                <input className={`form-control w-100 p-2`} defaultValue={field3Value} onChange={handlefield3} />
              </div>
            ) : null}

            <div className="d-flex justify-content-center">
              <button className={`btn ${darkMode? 'button-dark' : 'btn-light'} `} onClick={handleSent} style={{maxWidth: '200px', minWidth: '100px'}}>
              {t('page.save')}
              </button>
            </div>
          </form>
        </div>
      ) : <h2>{t('error')}</h2> }
    </div>
  )
}

export default EditItem;