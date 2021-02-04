const express = require('express')
const app = express()
var path = require('path');
const port = 3001

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.get("/transations", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/transations.html'));
});

app.get("/operation/:uuid", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/operation.html'));
});

app.use("/css", express.static('public/css'));
app.use("/images", express.static('public/images/'));
app.use("/webfonts", express.static('public/webfonts/'));
app.use("/js", express.static('public/js/'));
app.use("/lib", express.static('public/lib/'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})