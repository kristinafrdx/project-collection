import React from "react";
import { useState } from "react";
import { useTheme } from './context/ThemeContext';
import Header from "./Header";
// import { useTranslation } from 'react-i18next';

const CreateColl = () => {
  // const { t } = useTranslation();
  const { darkMode } = useTheme();
  const [inputs, setInputs] = useState([])
  const [nameField, setNameField] = useState('');

  const addField = () => {
    setInputs([...inputs, nameField])
    setNameField('')
  }

  const handleNameField = (e) => {
   setNameField(e.target.value)
  }

  return (
    <div>
      <Header showExit={true}></Header>
      <div className={`d-flex align-items-center flex-column vh-100 ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        <h2 className="pb-5 pt-4">Add collection</h2>
        <div className={`p-4 rounded shadow-lg ${darkMode ? 'inner-dark' : 'light-theme'} d-flex flex-column`} style={{ width: '50%'}}>
          <label htmlFor="name" className="fw-bold mb-3">
            Name of collection:
          </label>
          <input className='mb-4 form-control' required autoFocus></input>

          <label htmlFor="name" className="fw-bold mb-2">
            Category:
          </label>
          <input className='mb-4 form-control' required></input>

          <label htmlFor="name" className="fw-bold mb-2">
            Description:
          </label>
          <input type="text" className='form-control last-input mb-4' maxLength={'100'} size={'100'}></input>

          {inputs.map((el, index) => (
            <div key={index}>
              <label className="fw-bold mb-2" htmlFor={el}>{el}</label>
              <input className="form-control mb-2" type="text"></input>
            </div>
          ))}

          <label htmlFor="avatar" className="fw-bold mb-2">Choose a profile picture:</label>
          <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" className="mb-5"/>

          <div className="d-flex flex-row justify-content-start mb-4" style={{gap: '5px'}}>
            <input value={nameField} onChange={handleNameField} style={{width: '70%'}}></input>
            <button onClick={addField} className="btn btn-primary">Add field</button>
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary">Create</button>
          </div> 
        </div>
      </div>
    </div>
  )
}

export default CreateColl;