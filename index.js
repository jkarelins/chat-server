const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors")();
const parser = express.json();
const SSE = require("express-sse");

app.use(cors);
app.use(parser);

const db = {
  messages: []
};

const stream = new SSE();

app.get("/stream", (req, res) => {
  const old = {
    type: "OLD",
    payload: db.messages
  };
  stream.updateInit(old);

  stream.init(req, res);
});

app.post("/message", (req, res) => {
  if (req.body) {
    if (req.body.text) {
      const { text, username } = req.body;
      const newMessage = { text: text, username: username };
      console.log(newMessage);
      db.messages.push(newMessage);
      stream.send({
        type: "NEW",
        payload: newMessage
      });
      res.send(newMessage);
    } else {
      res.status(400).send({
        message: "Bad message"
      });
    }
  } else {
    res.status(400).send({
      message: "Bad message"
    });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
