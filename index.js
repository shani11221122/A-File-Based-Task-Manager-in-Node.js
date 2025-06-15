const express = require('express');
const path = require('path'); 
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.set('view engine', 'ejs');

// Route to render tasks
app.get('/', (req, res) => {
    fs.readdir('./files', function(err, files) {
        res.render('index', { files: files });
    });
});
app.get('/file/:filename', (req, res) => {
   fs.readFile(`./files/${req.params.filename}`, 'utf8', (err, filedata) => {
       
       res.render('show', { filename: req.params.filename , filedata: filedata  });
   });
});

app.get('/edit/:filename', (req, res) => {
 res.render('edit',{ filename: req.params.filename });
});

app.post('/edit', (req, res) => {
  const oldPath = `./files/${req.body.previous}`;
  const newPath = `./files/${req.body.new}`;

  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error renaming file');
    }
    res.redirect('/');
  });
});



// Route to create new task
app.post('/create', (req, res) => {
    const fileName = req.body.task.split(' ').join('') + '.txt';
    const content = req.body.details;

    fs.writeFile(`./files/${fileName}`, content, function(err) {
        if (err) {
            return res.status(500).send('Error creating file');
        }
        res.redirect('/');
    });
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
