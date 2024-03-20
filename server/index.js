import express from 'express';
import cors from 'cors';
import multer from "multer";
import { Dropbox } from 'dropbox';
import {
  getItems,
  getCollections, 
  getMyCollections,
  createUser,
  getUser,
  isAdmin, 
  isAlreadyExistUser,
  isCorrectDataUser,
  deleteCollection,
  createCollection,
  deleteItem,
  getCollection,
  addItem,
  deleteItems } from './database.js';
  import fs from 'fs';
  import dotenv from 'dotenv';

dotenv.config()

const app = express();
const PORT = 3030;

const dbx = new Dropbox({accessToken: process.env.ACCESS_TOKEN});
const upload = multer({dest: 'project-collection'});

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
  if (req.file) {
    try {
      const fileData = await fs.promises.readFile(req.file.path);
      const resp = await dbx.filesUpload({
        path: `/${req.file.originalname}`,
        contents: fileData,
      });
      const fileId = resp.result.id;
      try {
        const response = await dbx.sharingCreateSharedLinkWithSettings({
          path: fileId,
        });
        const sharedLink = response.result.url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
        res.json({message: sharedLink})
      } catch (error) {
        console.log(error);
      } finally {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.log(err)
          } else {
            console.log('file deleted')
          }
        });
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to upload' });
    }
  }
})

app.get('/items', async (req, res) => {
  const items = await getItems();
  res.send(items);
})

app.get('/collections', async (req, res) => {
  const collections = await getCollections();
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
    return res.json({isAdmin: admin, userId: userId});
  }
  return res.json({message: "data is't correct"});
})

app.post('/registration', async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const name = req.body.name;
  const isAlreadyExist = await isAlreadyExistUser(login);
  await createUser(login, password, false, name);
  const user = await getUser(login, password);
  const userId = user[0].id;
  if (isAlreadyExist) {
    res.json({ message: 'exist'} );
  } else {
    res.json({ message: 'notExist', id: userId} );
  }
  res.end()
});

app.post('/deleteColl', async (req, res) => {
  const { id } = req.body
  await deleteCollection(id);
  const updateColl = await getCollections();
  await deleteItems(id);
  res.json({message: 'ok', updateColl});
  
})

app.post('/createcoll', async (req, res) => {
  const id = req.body.data.userId;
  const name = req.body.data.name;
  const descr = req.body.data.description;
  const category = req.body.data.category;
  const inputs = req.body.inputs;
  const linkToImg = req.body.data.lin;
  const idColl = await createCollection(name, descr, category, id, inputs[0], inputs[1], inputs[2], linkToImg);
  res.json({message: 'ok'})
})

app.post('/addItem', async (req, res) => {
  const name = req.body.nameItem;
  const id = req.body.idC;
  const tag = req.body.tag;
  const valueField = req.body.valueField;
  const values = Object.values(valueField);
  await addItem(name, tag, id, values[0], values[1], values[2]);
  res.json({message: 'ok'});
})


app.post('/getcollection', async (req, res) => {
  const idCollection = req.body.idColl;
  const items = await getItems(idCollection);
  const collection = await getCollection(idCollection);
  // const descr = removeMarkdownSymbols(collection.description);
  res.json({items, collection});
})

app.post('/deleteItem', async (req, res) => {
  const idItem = req.body.id;
  const idColl = req.body.idC;
  await deleteItem(idItem);
  const update = await getItems(idColl)
  res.json({message: 'ok', items: update});
})

app.listen(PORT, () => {
  console.log(`SERVER IS LISTENING ON PORT: ${PORT}`)
})
