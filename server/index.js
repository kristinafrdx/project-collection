import express from 'express';
import cors from 'cors';
import { 
  getItems,
  getCollections, 
  getCollection,
  getItem,
  addCollection,
  addItem,
  deleteCollection,
  deleteItem,
  getUsers,
  getUser,
  isAdmin, 
  // isAlreadyExistUser,
  isCorrectDataUser} from './database.js';

const app = express();
const PORT = 3030;

app.use(cors());
app.use(express.json());

// const pathToCollect = '/collections'
// app.get('/collections', async (req, res) => {
//  

//  res.send(collections);
// })

app.get('/items', async (req, res) => {
  const items = await getItems();
  res.send(items);
})

app.post('/login', async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const isCorrectData = await isCorrectDataUser(login, password);
  if (isCorrectData) {
    const user = await getUser(login, password);
    const userId = user[0].id;
    const collections = await getCollection(userId);
    const admin = await isAdmin(login, password);
    return res.json({isAdmin: admin, usersCollections: collections});
  }
    return res.json({message: "data is't correct"});
})

app.listen(PORT, () => {
  console.log(`SERVER IS LISTENING ON PORT: ${PORT}`)
})
