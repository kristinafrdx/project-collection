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

export const getItems = async () => {
  const [items] = await pool.query("SELECT * FROM items");
  return items
}

export const getCollections = async () => {
  const [collections] = await pool.query("SELECT * FROM collections");
  return collections;
}

export const getCollection = async (idUser) => {
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

export const addCollection = async (name, descr, topic, createdBy) => {
  const [newCollection] = await pool.query(`
    INSERT INTO collections (name, description, topic, createdBy)
    VALUES (?, ?, ?, ?)`,
    [name, descr, topic, createdBy]);
  return newCollection;
  }

export const addItem = async (name, tag) => {
  const [newItem] = await pool.query(`
    INSERT INTO items (name, tag)
    VALUES (?, ?)`,
    [name, tag]);
  return newItem;
}

export const deleteItem = async (id) => {
  await pool.query(`
  DELETE FROM items
  WHERE id = ?`,
  [id])
  return;
}

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

// export const isAlreadyExistUser = async (login) => {
//   const [result] = await pool.query(
//    `SELECT * FROM users
//     WHERE login = ?`,
//     [login])
//     return result.length > 0 ? true : false
// }

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



// export const createUser = async (login, password) => {
//   const [newUser] = await pool.query(
//     `INSERT INTO users (name, login, password)
//    VALUES (?, ?, ?, ?)`,
//     [name, login, status, password])
//    return newUser;
// // }
// const collections = await getCollections();
// const items = await getItems();
