import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();

export const getItems = async (id) => {
  const [items] = await pool.query(`
  SELECT * FROM items
  WHERE idCollection = ?`,
  [id]);
  return items;
}

export const getCollections = async () => {
  const [collections] = await pool.query("SELECT * FROM collections");
  return collections;
}

export const getCollection = async (id) => {
  const [collections] = await pool.query(`
  SELECT * FROM collections
  WHERE id = ?`,
  [id]);
  return collections;
}

export const getMyCollections = async (idUser) => {
    const [collection] = await pool.query(`
    SELECT * 
    FROM collections 
    WHERE createdBy = ?
  `, [idUser])
  return collection;
}

export const getItem = async (id) => {
  const [item] = await pool.query(`
  SELECT * 
  FROM items 
  WHERE id = ?
  `, [id])
  return item[0];
}

export const renameColumn = async (field, index) => {
  const [newColumn] = await pool.query(`
  ALTER TABLE collections
  RENAME COLUMN field${index + 1} to ${field}`)
  return newColumn;
}
// export const addColumn2 = async (field) => {
//   const [newColumn] = await pool.query(`
//   ALTER TABLE collections
//   CHANGE COLUMN field2 to ?`,
//   field)
//   return newColumn;
// }
// export const addColumn3 = async (field) => {
//   const [newColumn] = await pool.query(`
//   ALTER TABLE collections
//   RENAME COLUMN field3 to ${field}`)
//   // return newColumn;
// }


export const createCollection = async (name, descr, topic, createdBy) => {
  const [newCollection] = await pool.query(`
    INSERT INTO collections (name, description, topic, createdBy)
    VALUES (?, ?, ?, ?)`,
    [name, descr, topic, createdBy]);
  return newCollection;
  }

// export const addItem = async (name, tag) => {
//   const [newItem] = await pool.query(`
//     INSERT INTO items (name, tag)
//     VALUES (?, ?)`,
//     [name, tag]);
//   return newItem;
// }

// export const deleteItem = async (id) => {
//   await pool.query(`
//   DELETE FROM items
//   WHERE id = ?`,
//   [id])
//   return;
// }

export const deleteCollection = async (id) => {
  await pool.query(`
  DELETE FROM collections
  WHERE id = ?`,
  [id])
  return;
}

export const getUsers = async () => {
  const [users] = await pool.query(`SELECT * FROM users`)
  return users;
}

export const isAlreadyExistUser = async (login) => {
  const [result] = await pool.query(
   `SELECT * FROM users
    WHERE login = ?`,
    [login])
    return result.length > 0 ? true : false
}

export const isCorrectDataUser = async (login, password) => {
 const [result] = await pool.query(
  `SELECT * FROM users
  WHERE login = ?
  AND password = ?`,
  [login, password])
  return result.length === 0 ? false : true
}

export const getUser = async (login, password) => {
  const user = await pool.query(`
  SELECT * FROM users 
  WHERE login = ?
  AND password = ?`,
  [login, password])
  return user[0];
}

export const isAdmin = async (login, password) => {
  const [result] = await pool.query(
    `SELECT * FROM users
    WHERE login = ?
    AND password = ?
    AND admin = true`,
    [login, password])
  return result.length > 0 ? true : false
}

export const createUser = async (login, password, admin, name) => {
  const [newUser] = await pool.query(
    `INSERT INTO users (login, password, admin, name)
   VALUES (?, ?, ?, ?)`,
    [login, password, admin, name])
   return newUser;
}

export const createItem = async (name, tag, idCollection) => {
  const [newItem] = await pool.query(
    `INSERT INTO items (name, tag, idCollection)
   VALUES (?, ?, ?)`,
    [name, tag, idCollection])
   return newItem;
}

// const collections = await getCollections();
// const items = await getItems();
