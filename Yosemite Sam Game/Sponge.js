var canvas = document.getElementById("myCanvas");
var context=canvas.getContext('2d');

var arkaplan =new Image();
var oyuncu=new Image();
var duvar=new Image();
var kutu=new Image();
var mermi=new Image();
var ev=new Image();
var menu_pic=new Image();
var gameovermenu_pic=new Image();

var num,height,score=0,myScore;
var background_x=0;
var background_y=480;
var player_x=160;
var player_y=360;
var key=[0,0,0,0,0];

var fire=[];

var boxes=[];
boxes[0] = {
    x : 1400,
    y : 360
};
var shotReady = false;
var isItFired = false;
var isGrounded = true;
var isPressed = false;
var isgameOver=false;
var isButtonDown=false;
var timer;

arkaplan.src = "img/back.png";
duvar.src = "img/wall_1.png";
oyuncu.src = "img/sam.png";
kutu.src = "img/box2.png";
mermi.src = "img/bullet.png";
ev.src = "img/house.png";
menu_pic.src = "img/menu.png";
gameovermenu_pic.src = "img/gameover.jpg";


function setup(){
    mySound = new sound("sounds/firesound.mp3");
    myBomb = new sound("sounds/bomb.mp3");
    myMenu = new sound("sounds/menuSound.mp3");
    myGameOverMenu = new sound("sounds/GameOverSound.mp3");
    window.addEventListener('keydown', function(e) { changeKey(e.keyCode, 1) });
    window.addEventListener('keyup', function(e) { changeKey(e.keyCode, 0) });
    menu();
}
function loop(){
    clear();
    draw();
    update();
}
function reset(){
    myGameOverMenu.play();
    isgameOver=true;
    clearInterval(timer);
    Game_Over_menu();
}
function update(){
    jump();
    yer_cekimi(); 
    move();
   
    if(key[4]==1 && isItFired== false){  //fire
        fires();
        mySound.play();
    } 
    
    if(player_x+10<=0){
        player_x=0;
    }
}
function move(){
    

    if (key[2]==1 && isGrounded == true){  //Up
        isGrounded = false;
        isPressed = true;
    }
    if( key[0]==1){// left
          player_x=player_x-6;
    }
    if( key[1]==1){// right
        player_x=player_x+6;
    }
}
function jump(){
    if(player_y>=60 && isPressed == true){
        player_y=player_y-12;
    }
    else{
        isPressed = false;
    }
}
function yer_cekimi(){
    if(player_y<360){
        player_y=player_y+4.5;
    } else {
        isGrounded = true;
    }
}

function clear(){

    context.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
}

function fires(){
        if(isItFired==false){
            isItFired=true;
            fire.push({
                 x : player_x+50,
                 y : player_y+20
            });
        }
}
function draw(){

   context.drawImage(arkaplan,0,0);
   context.drawImage(duvar,background_x,background_y,1400,200);
   context.drawImage(ev,-70,10,320,500);
   context.drawImage(oyuncu,player_x,player_y,120,120);
   
    if(boxes.length==0){
        boxes.unshift({
            x : 1400,
            y : 360
            }); 
    }
    for(var i = 0; i < boxes.length; i++){

        var sayi=Math.floor(Math.random() * 5); 
        var x_1=(1400+sayi*40);
        var y_1=(360-sayi*70);
        context.drawImage(kutu,boxes[i].x,boxes[i].y,120,120);
        boxes[i].x-=4;
        if( boxes[i].x == 1200 ){
            boxes.unshift({
            x : x_1,
            y : y_1
            });  
        }
        if( boxes[i].x <=170){
            myBomb.play();
            reset();
        }
    }    
    boxes.forEach((bx) => {
        if( (player_x+100>bx.x) && (player_y+120>bx.y) && (player_x-120<bx.x) && (player_y-120<bx.y)){
            myBomb.play();
            reset();
       }
    });
    if(isItFired==true){

        fire.forEach(function(ball,a) {
            context.drawImage(mermi,ball.x,ball.y,40,40);
            ball.x+=10;
            boxes.forEach(function(boxx,i) {
                if(ball.x+40>=boxx.x && ball.y+100>=boxx.y && ball.y-120<=boxx.y){
                    boxes.splice(i,1);
                    fire.splice(a,1);
                    isItFired=false;
                    score=score+10;
                }
            }); 
            if(ball.x>1350){
                fire.splice(a,1);
                isItFired=false;
            }
        });
    }

   if(!isgameOver){
    context.fillStyle = '#000000';
    context.font = '24px Arial';
    context.textAlign = 'right';
    context.fillText('Score: ' + score, 1300, 40);
   }
}

function changeKey(which, to) {
    switch (which) {
        // left
        case 37:
          key[0] = to;
          //isJumped = true;
          break;
        // up
        case 38:
          key[2] = to;
          break;
        // right
        case 39:
          key[1] = to;
          break;
        // down
        case 40:
          key[3] = to;
          break;
        // space bar;
        case 32:
          key[4] = to;
          break;
    }
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}
function menu() {
    context.drawImage(menu_pic,0,0,1350,600);
    context.fillStyle = '#FFFAFA';
    context.font = 'bold 56px Arial';
    context.textAlign = 'center';
    context.fillText("Tnt'leri Yok Edin!", 1100,70);
    context.font = 'bold 40px Arial';
    context.lineJoin = "round";
    context.fillText("Yosemite Sam'in Evini Koruyun.", 400, 35);
    context.font = 'bold 36px Arial';
    context.fillText(" Tnt'ler Size Veya Eve Carptiginda Patlayacaktir.", 400, 100);
    context.font = 'bold 40px Arial';
    context.fillText('Oynamak Icin Tiklayin..', 1100 , 530);
    context.font = 'bold 40px Arial';
    context.fillText('Hareket Etmek Icin Yon Tuslarini , ', 400,500);
    context.font = 'bold 40px Arial';
    context.fillText('Ates Etmek Icin Space Tusunu Kullanin..',400,565);
    canvas.addEventListener('click',start,false);
}
function start(){
    if(!isButtonDown){
         timer=setInterval(loop,10);
    } 
    isButtonDown=true;   
}
function Restart(){
    window.location.reload(false);
    timer=setInterval(loop,10);
}

function Game_Over_menu() {
    context.drawImage(gameovermenu_pic,0,0,1350,600);
    context.fillStyle = '#FFFAF0';
    context.font = 'bold 56px Arial';
    context.textAlign = 'center';
    context.fillText('Oyun Bitti', 680,90); 
    context.font = 'bold 40px Arial';
    context.textAlign = 'right';
    context.fillText('Skorunuz: ' + score, 1300 , 60);
    context.fillStyle = '#FFFAF0';
    context.font = 'bold 36px Arial';
    context.fillText('Tekrar Oynamak Icin Tiklayiniz..', 1280, 520);
    

    //isButtonDown=false;
    canvas.addEventListener('click',Restart,false);
  }

  window.onload = () => setup();
  

