var config =
{
    type: Phaser.CANVAS,
    width: 32 *24,  //view width
    height: 32 *16, //view height
    pixelArt: true, //good for pixels
    scene: [Level1, Level2, Level3],    //the scenes will be played
    physics: {default: 'arcade', arcade:{gravity: {y:600} } }   //physics

};

var game = new Phaser.Game(config); //game config variable