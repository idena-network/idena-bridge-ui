const express = require('express')
const app = express()
var path = require('path');
const axios = require("axios");
require('dotenv').config();
const port = 3000

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.get("/swap", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/swap.html'));
});
app.get("/faq", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/faq.html'));
});
app.get("/transactions", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/transactions.html'));
});
app.get("/operation/:uuid", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/operation.html'));
});
app.get("/submit", function (req, res) {
  res.sendFile(path.join(__dirname + '/public/submit.html'));
});

app.get("/api/submit", async function (req, res) {
  const contentType = req.header("Content-Type")
  if (!contentType || contentType.toLowerCase() !== "application/json") {
    res.sendFile(path.join(__dirname + '/public/submit.html'));
    return
  }
  const uuid = req.query.uuid
  const tx = req.query.tx
  const resp = await axios.post(process.env.API_URL + "/swaps/assign", {
    uuid: uuid,
    tx: tx
  })
  const url = process.env.BRIDGE_URL + `/operation/${uuid}`
  const respJson = {
    success: resp.status === 200,
    url: url
  }
  if (!respJson.success) {
    respJson.error = "Failed to submit transaction"
  }
  res.status(resp.status).json(respJson)
});

app.use("/css", express.static('public/css'));
app.use("/images", express.static('public/images/'));
app.use("/webfonts", express.static('public/webfonts/'));
app.use("/js", express.static('public/js/'));
app.use("/lib", express.static('public/lib/'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})