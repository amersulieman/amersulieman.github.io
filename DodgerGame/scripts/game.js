//configuration of the phaser game
var config =
{
    //type:Phaser.CANVAS, //game renderer
    width: 640,         //game width
    height: 480,        //game height
   // pixelArt: true,     //pixel art for game better quality pixel
    scene:[PlayScene],  //game scenes
    physics: {default:'arcade'}     //physics without gravity
};

var game = new Phaser.Game(config);