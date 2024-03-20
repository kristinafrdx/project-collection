import React, { useEffect, useState } from 'react';
import { useTheme } from "./context/ThemeContext";
import { useTranslation } from 'react-i18next';
import Header from './Header';
import axios from 'axios';
import { useUser } from './context/UserContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [err, setError] = useState(false);
  const { setUserRole, userRole, setUserId, userId } = useUser();
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const [selected, setSelected] = useState(null);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [showDeleteButton, setShowDelete] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const resp = await axios.get('http://localhost:3030/admin')
      const us = resp.data.users;
      setUsers((prev) => [...prev, ...us]);
    }
    fetchUsers();
  }, [])

  const deleteUser = async () => {
    const resp = await axios.post("http://localhost:3030/deleteUsers", { selected });
    setUsers(resp.data.new)
    setSelected(null)
  }

  const handleSelect = (id) => {
    if (selected === id) {
      setSelected(null);
      setCheckboxChecked(false)
      setShowDelete(false)
    } else {
      setCheckboxChecked(!checkboxChecked);
      setSelected(Number(id));
      setShowDelete(true)
    }
  }

  const handleReset = (e) => {
    const isInsideTable = e.target.closest('table');
    const isInsideRow = e.target.closest('tr');
    const isInsideCell = e.target.closest('td') || e.target.closest('th');
    if (!isInsideCell || !isInsideRow || !isInsideTable) {
      setSelected(null);
      setCheckboxChecked(false);
      setShowDelete(false)
    }  
  }

  const handleMakeAdmin = async (id, status, userRole) => {
    const resp = await axios.post('http://localhost:3030/makeAdmin', { id, status })
    const update = resp.data.update;
    setUserRole(userRole);
    setUsers(update);
    setSelected(null);
  }

  return (
  <div>
    <Header showExit={true} app={true} path={'/collections'}></Header>
    <div
      className={`${darkMode ? 'dark-theme' : ''}`} 
      style={{padding: '20px 20px 0', minHeight: '100vh', paddingLeft: '0', paddingRight: '0' }} 
      onClick={(e) => handleReset(e)}>
    { showDeleteButton ? (
      <div className='d-flex justify-content-end container' style={{gap: '20px'}}>
        <button 
          className={`btn adminButton ${darkMode ? 'button-dark' : 'btn-light'}`} 
          onClick={deleteUser} 
        >
          DELETE
        </button>
        <button 
          className={`btn adminButton ${darkMode ? 'button-dark' : 'btn-light'}`} 
          onClick={() => handleMakeAdmin(selected, true, 'admin')}
        >
          Make admin
        </button>
        <button 
          className={`btn adminButton ${darkMode ? 'button-dark' : 'btn-light'}`} 
          onClick={() => handleMakeAdmin(selected, false, 'user')}
        >
          Make user
        </button>
      </div>
    ) : null}

    <div className='d-flex justify-content-center container'>
      <table style={{width: '100%', marginTop: '20px', paddingLeft: '0', paddingRight: '0'}}>
        <thead>
          <tr>
            <th />
            <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>id</th>
            <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>name</th>
            <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>login</th>
            <th className={`th ${darkMode ? 'adminHeadTable-dark' : ''}`}>status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} onClick={() => handleSelect(user.id)}>
              <td className={`${darkMode ? '' : 'light-theme'}`} style={{textAlign: 'end', width: '30px'}}>
                <input className={`checkbox ${darkMode ? 'select-dark' : ''}`} type="radio" checked={selected === user.id} onChange={() => handleSelect(user.id)}/>
                <label></label>
              </td>
              <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{user.id}</td>
              <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{user.name}</td>
              <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{user.login}</td>
              <td className={`th ${darkMode ? 'inner-dark' : 'light-theme'}`}>{user.admin === 1 ? 'Admin' : 'User'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  </div>
)
}
export default Admin;