// This file sets up the game configurations and runs the game through phaser
var config =
{
    //The width and height now only show each screen 8 tiles x 8 tiles
    type: Phaser.CANVAS,                                //HTML Rendering API
    width: 64 * 8,                                  //64px/tiles * 8 tiles/screen
    height: 64 * 8,                                 //64px/tiles * 8 tiles/screen
    pixelArt: true,                                     //This is important to optimize the pixel art
    scene: [World],                                     //Scenes for this game
    physics: {default: 'arcade', arcade:{gravity:0}}    //physics for collision only, no gravity
};

var game = new Phaser.Game(config);                     //starts game with these configurations