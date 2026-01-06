const fl = require('./helper');

const express = require("express");
const app = express();
const PORT = 3000;
const bodyParder = require("body-parser");

app.use(bodyParder.json());

app.get('/', (request, response) => {
    response.send("Hello World TESSS");
});

app.post('/login', async (req, res)=>{
    const {username} = req.body;
    console.log(username);
    if(username === "hatfan") return res.send({jawaban : "berhasil login"});
    else return res.send({jawaban :"salah login"});
});

app.post('/add', async (req, res)=>{
  try {
    const {filename} = req.body;
    const {fileId, fileName} = await fl.addFile(filename);
    return res.send({
      succes : 'true',
      message : `File ${filename} berhasil ditambahkan`
    });
  } catch (error) {
    return res.send({
      succes : 'false',
      message : `File ${filename} gagal ditambahkan`
    });
  }
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})