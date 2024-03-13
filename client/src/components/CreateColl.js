import React from "react";
import { useState } from "react";
import { useTheme } from './context/ThemeContext';
import Header from "./Header";
// import { useTranslation } from 'react-i18next';
import remove from "../logo/remove.svg";
import { useNavigate } from "react-router-dom";

const CreateColl = () => {
  // const { t } = useTranslation();
  const { darkMode } = useTheme();
  const [inputs, setInputs] = useState([])
  const [nameField, setNameField] = useState('');
  const [valueField, setValue] = useState('');
  const [values, setValues] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescr] = useState('');
  const [category, setCategory] = useState('')

  const maxFields = 5;
  const navigate = useNavigate();
  const addField = () => {
    if (inputs.length < maxFields) {
      setInputs([...inputs, nameField ])
      setValues([...values, valueField]);
      setValue('');
      setNameField('')
    }
  }

  const handleName = (e) => {
    setNameField(e.target.value)
  }

  const handleRemoveField = (index) => {
    setInputs(inputs.filter((_, i) => i!== index));
    setValues(values.filter((_, i) => i!== index));
  }

  const handleValue = (e) => {
    setValue(e.target.value)
  }

  const newValue = (e, index) => {
    const newValues = [...values];
    newValues[index] = e.target.value;
    setValues(newValues);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data1 = {
      name,
      category,
      description,
    }

    inputs.forEach((key, index)=> {
      data1[key] = values[index]
    });
    console.log(data1)
  }

  const handleCategory = (e) => {
    setCategory(e.target.value)
  }

  const handleDescr = (e) => {
    setDescr(e.target.value);
  }

  const handleNameColl = (e) => {
    setName(e.target.value)
  }

  return (
    <div>
      <Header showExit={true}></Header>
      <div className={`d-flex align-items-center flex-column ${darkMode ? 'dark-theme' : 'light-theme'}`} style={{height: '100%', paddingBottom: '100px'}}>
        <h2 className="pb-5 pt-4">
          Add collection
        </h2>
        <div className={`p-4 rounded shadow-lg ${darkMode ? 'inner-dark' : 'light-theme'} d-flex flex-column`} style={{ width: '50%'}}>
        <form className="p-4 pt-2" onSubmit={handleSubmit}>
          <label htmlFor="name" className="fw-bold mb-3">
            Name of collection:
          </label>
          <input onChange={handleNameColl} className='mb-4 form-control' id="name" required autoFocus></input>

          <label htmlFor="category" className="fw-bold mb-2">
            Category:
          </label>
          <input onChange={handleCategory} id="category" className='mb-4 form-control' required></input>

          <label htmlFor="description" className="fw-bold mb-2">
            Description:
          </label>
          <input onChange={handleDescr} id="description" type="text" className='form-control last-input mb-4' maxLength={'100'} size={'100'}></input>
           
           {inputs.map((el, index) => (
            <div key={index}>
              <label className="fw-bold mb-2" htmlFor={el}>{el}</label>
              <div key={index} className="d-flex align-items-center mb-4">
                <input id={el} onChange={(e) => newValue(e, index)} className="addedField form-control" style={{width: '100%'}} value={values[index]}></input>
                <button type="button" className="linkButton" onClick={() => handleRemoveField(index)}>
                  <img className="remove" src={remove}></img>
                </button> 
              </div>
            </div>
          ))}

          {/* <label htmlFor="avatar" className="fw-bold mb-2">Choose a profile picture:</label>
          <input type="file" id="avatar" accept="image/png, image/jpeg" className="mb-5" placeholder="Choose a file"/> */}
          { inputs.length < 5 ? (
            <div>
              <label className="mb-2 fw-bold">
                Enter name of field:
              </label>
              <div className="d-flex flex-row justify-content-between mb-2" style={{gap: '5px'}}>
                <input value={nameField} className="form-control" onChange={handleName} placeholder="Author" style={{width: '100%', marginRight: '10px'}}></input>
                <label htmlFor="value"></label>
                <input value={valueField} id='value' className="form-control" onChange={handleValue} placeholder={'Jack London'} style={{width: '100%'}}></input>
                <button onClick={addField} className={`btn ${darkMode ? 'button-dark' : 'btn-light'}`} style={{height: '40px'}}>
                  Add
                </button>
              </div>
            </div>
          ) : null}
          <div className="d-flex justify-content-center">
            <button onClick={handleSubmit} className={` btn ${darkMode ? 'button-dark' : 'btn-light'} mt-2`} style={{minWidth: '100px', marginRight: '10px'}}>
              Create
            </button>
            <button onClick={() => navigate('/collections')} className={`btn mt-2 ${darkMode ? 'button-dark' : 'btn-light'}`} style={{minWidth: '100px'}}>Back</button>
          </div> 
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateColl;