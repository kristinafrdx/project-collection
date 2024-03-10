import express from 'express';
import cors from 'cors';
import { 
  getItems,
  getCollections, 
  getMyCollections,
  createUser,
  getUser,
  isAdmin, 
  isAlreadyExistUser,
  isCorrectDataUser} from './database.js';

const app = express();
const PORT = 3030;

app.use(cors());
app.use(express.json());

app.get('/items', async (req, res) => {
  const items = await getItems();
  res.send(items);
})

app.get('/collections', async (req, res) => {
  // const idUser = req.body.id
  const collections = await getCollections();

  // const getMy = await getMyCollections(idUser);
  res.json({collections});
})

app.post('/myCollections', async (req, res) => {
  const idUser = req.body.userId
  const getMy = await getMyCollections(idUser);
  res.json({ getMy });
})

app.post('/login', async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const isCorrectData = await isCorrectDataUser(login, password);
  if (isCorrectData) {
    const user = await getUser(login, password);
    const userId = user[0].id;
    const admin = await isAdmin(login, password);
    return res.json({isAdmin: admin, usersId: userId});
  }
    return res.json({message: "data is't correct"});
})

app.post('/registration', async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const name = req.body.name;
  const isAlreadyExist = await isAlreadyExistUser(login);
  await createUser(login, password, false, name);
  if (isAlreadyExist) {
    res.json({ message: 'exist'} );
  } else {
    res.json({ message: 'notExist'} );
  }
  res.end()
});

app.listen(PORT, () => {
  console.log(`SERVER IS LISTENING ON PORT: ${PORT}`)
})
