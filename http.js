var express = require('express'),
app = express(),
port = '8080',
io = require('socket.io')(),
bodyParser = require('body-parser');

var playCard = {
  game: [{session:'Waiting for Players', turn: 0}],
  table: [{number:'2', color:'blue'}],
  players: [
  {
    id: 99,
    cards: [
    {number: '1', color: 'blue'},
    {number: '1', color: 'red'},
    {number: '1', color: 'yellow'},
    {number: '2', color: 'green'},
    {number: '1', color: 'green'},
    {number: '1', color: 'yellow'},
    {number: '3', color: 'blue'}
    ]
  },
  {
    id: 99,
    cards: [
    {number: '', color: ''},
    {number: '', color: ''}
    ]
  },
  {
    id: 99,
    cards: [
    {number: '', color: ''},
    {number: '', color: ''},
    {number: '', color: ''}
    ]
  },
  {
    id: 99,
    cards: [
    {number: '', color: ''},
    {number: '', color: ''},
    {number: '', color: ''},
    {number: '', color: ''}
    ]
  }
  ]
};

app.use(bodyParser.urlencoded({extended: false}));

app.use('/', express.static('public')); //ROUTE the /web

io.listen(app.listen(port));

io.on('connection', function (socket) {
  var i;
  console.log('It appears someone activated the socket: ' + socket.id);
  socket.emit('status', playCard.game[0].session);
  //For loop to assign ID a deck or send game status to players if Game in Session
  if (playCard.game[0].session === 'Waiting for Players') {
    for (i = 0; i < playCard.players.length; i++) {
      if (i === 3) { //Checking if all player slots are filled, need this before break
        var turn = playCard.game[0].turn;
        playCard.game[0].session = 'Game in Session'; //Every update game.js will redraw table
        io.emit('status', 'Game in Session');  //Client screen will go 'yay! game started'
        io.emit('table', playCard.table[0]); //Send table card data to client to populate current card.
        io.emit('status', playCard.players[turn].id); //Client will check to see if the id matches themselves and annonce if its their turn or not
        console.log('The game has started and its ' + playCard.players[turn].id + ' turn.');
      }
      if (playCard.players[i].id === socket.id) { //Check if existing player connected for status update
        socket.emit('status', playCard.game[0].session);
      }
      else {
        if (playCard.players[i].id === 99) {
          playCard.players[i].id = socket.id;
          console.log('Player ' + socket.id + ' has joined the current game session. ' +  playCard.players[i].id);
          break;
        }
      }
    }
  }
  else { //Game is full, see if game is over and reset game for new one if needed.
    for (i = 0; i < playCard.players.length; i++) {
      if (playCard.players[i].length === 0) {
        playCard.game[0].session = 'Game End';
      }
    }
    if (playCard.game[0].session === 'Game End') {
      for (i = 0; i < playCard.players.length; i++) {
        playCard.players[i].id = 99;
      }
    }
    socket.emit('status', 'Game is full'); //Send private message to the fifth client joining saying the game is full
  }
});

io.on('play', function (socket) {
  var turn = playCard.game[0].turn;
  var playerTurn = playCard.players[turn].id;
  if (socket.id === playerTurn) {
    //Basically, check if the incomming card is valid in players deck and remove card from their deck
    socket.emit('cards', playCard.players[turn].cards);
    //determine if card was valid or if player needs to play correct card before incrementing turn, also include if statement if it needs to reset counter to 0
    playCard.game[0].turn++;
  }
  else {
    io.emit('status', playerTurn); // If this then resend data to clients saying whose turn it is to active eventlistener to stop incorrect players playing
  }
  io.emit('table', playCard.table[0]); //Since play was made, resend the current card on table to players to see current card
});

console.log(port + ' is the port your webserver is running on.');