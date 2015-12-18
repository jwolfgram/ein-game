var express = require('express'),
app = express(),
path = require('path'),
port = '8080',
bodyParser = require('body-parser');

var playCard = {
  table: [{number:'1', color:'red'}],
  players: [
  {
    id: 1,
    cards: [
      {number: '1', color: 'blue'},
      {number: '2', color: 'red'},
      {number: '3', color: 'yellow'},
      {number: '4', color: 'green'},
      {number: '', color: 'drawfour'},
      {number: '6', color: ''},
      {number: '7', color: ''}
    ]
  },
  {
        id: 2,
    cards: [
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''}
    ]
  },
  {
    id: 3,
    cards: [
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''}
    ]
  },
  {
    id: 4,
    cards: [
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''},
      {number: '', color: ''}
    ]
  }
  ]
};

app.use(bodyParser.urlencoded({extended: false}));

app.get('/game-state', function(req, res) {
  res.send(playCard);
  //next();
});

app.use('/', express.static('public')); //ROUTE the /web

app.listen(port);
console.log(port + ' is the port your webserver is running on.');