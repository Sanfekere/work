var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');


var playerImg = new Image();
playerImg.src = 'IMG/trashman.jpg';


var bottleImg = new Image();
bottleImg.src = 'IMG/bottle.png';
var toxicImg = new Image();
toxicImg.src = 'IMG/toxic.png';
var glassImg = new Image();
glassImg.src = 'IMG/glass.png';
var orgtrashImg = new Image();
orgtrashImg.src = 'IMG/orgtrash.png';
var backgroundImg = new Image();
backgroundImg.src = 'IMG/background.jpg';

var infoBoxElement = document.getElementById('infoBox');

var player = { x: 400, y: 300, width: 50, height: 50 };
var objects = [];
var score = 0;
var gameInterval, objectInterval;

document.getElementById('startButton').addEventListener('click', startGame);

function startGame() {
  objects = [];
  score = 0;
  currentScore.textContent = score;
  var time = 90;
  timeLeft.textContent = time;
  placePlayer();

  gameInterval = setInterval(function() {
    time--;
    timeLeft.textContent = time;
    if (time <= 0 || score >= 20) {
      endGame();
    }
  }, 1000);

  objectInterval = setInterval(spawnObject, 2000);

  document.addEventListener('keydown', movePlayer);

  infoBoxElement = document.getElementById('infoBox');
}

function placePlayer() {
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height / 2 - player.height / 2;
  drawPlayer();
}

function drawPlayer() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  if (playerImg.complete) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  } else {
    console.error("Spēlētājs nav ielādējies");
  }

  objects.forEach(drawObject);
}

function movePlayer(e) {
  var speed = 15;
  if (e.key === 'ArrowLeft') player.x -= speed;
  if (e.key === 'ArrowRight') player.x += speed;
  if (e.key === 'ArrowUp') player.y -= speed;
  if (e.key === 'ArrowDown') player.y += speed;
  collisionDetection();
  drawPlayer();
}

function spawnObject() {
  var object = {
    x: Math.random() * (canvas.width - 50),
    y: Math.random() * (canvas.height - 50),
    width: 50,
    height: 50,
    type: Math.random() < 0.52 ? 'toxic' : (Math.random() < 0.5 ? 'bottle' : (Math.random() < 0.5 ? 'glass' : 'orgtrash'))
  };
  objects.push(object);

  setTimeout(function() {
    objects = objects.filter(function(o) { return o !== object; });
    drawPlayer();
  }, 5000);
}

function drawObject(object) {
  var img;
  switch (object.type) {
    case 'bottle':
      img = bottleImg;
      break;
    case 'toxic':
      img = toxicImg;
      break;
    case 'glass':
      img = glassImg;
      break;
    case 'orgtrash':
      img = orgtrashImg;
      break;
  }
  ctx.drawImage(img, object.x, object.y, object.width, object.height);
}

function collisionDetection() {
  objects.forEach(function(object, index) {
    if (player.x < object.x + object.width &&
        player.x + player.width > object.x &&
        player.y < object.y + object.height &&
        player.y + player.height > object.y) {


      if (object.type === 'bottle' || object.type === 'glass' || object.type === 'orgtrash') {
        score++;
        currentScore.textContent = score;
        var plasticBottleSound = new Audio('Sound/bonus.wav');
        plasticBottleSound.volume = 0.4;
        plasticBottleSound.play();
      } else {
        score--;
        currentScore.textContent = score;
        var sodaCanSound = new Audio('Sound/lostpoint.mp3');
        sodaCanSound.play();
      }
      objects.splice(index, 1);

      if (score === 1) {
        Fact1.textContent = "Apglabājot atkritumus šūnā, tiem sadaloties, veidojas metāna gāze(CH4) un notekūdeņi (infiltrāts). ";
        Fact1.style.display = 'block';
      } else if (score === 4) {
        Fact2.textContent = 'Pirmajās 3-4 nedēļās atkritumi tiek laistīti ar Perkolātu, kuras laikā notiek hidrolīze un izšķīdušas organiskās vielas tiek aizsūknētas uz reaktoriem';
        Fact2.style.display = 'block';
      } else if (score === 8) {
        Fact3.textContent = 'Reaktorā izšķīdūšas organiskās vielas pakļaujas fermentācijas procesam kuras rezultātā rodas gāze, kuru atīra pēc kā to lieto citām vajadzībām';
        Fact3.style.display = 'block';
      } else if (score === 10) {
        Fact4.textContent = 'Tuneļlu izsūknētais gaiss tiek atīrīts caur biofiltriem';
        Fact4.style.display = 'block';
      } else if (score === 15) {
        Fact5.textContent = 'Par atkritumiem var uzskatīt jebkuru vielu vai priekšmetu, no kā to īpašniekam ir jāatbrīvojas. ';
        Fact5.style.display = 'block';
      } else if (score === 18) {
        Fact6.textContent = 'Atkritumu bīstamību nosaka atkritumu sastāvā esošo bīstamo vielu īpašības un to daudzums. Šādus atkritumus šķiro, īpaši atdalot stiklu, papīru, plastmasu.';
        Fact6.style.display = 'block';
      }
    }
  });
}

  function endGame() {
    clearInterval(gameInterval);
    clearInterval(objectInterval);
    document.removeEventListener('keydown', movePlayer);

    if (score >= 20) {
      var winSound = new Audio('Sound/win.wav');
      winSound.play();
      alert('Uzvara! Jūs savācāt ' + score + ' atkritumu vienības!');
    } else {
      var loseSound = new Audio('Sound/loss.wav');
      loseSound.play();
      alert('Zaudējums! Jūs savācāt ' + score + ' atkritumu vienības. Vingrinieties atkritumu šķirošanā!');
    }
  }