//Class that handles the monster info
class Enemy extends Phaser.Physics.Arcade.Sprite
{
    //constructor
    constructor(scene){
        //takes scene the enemy will be created and x, y coordinates and the key name of the enemy
        super(scene,500,500,'enemy');
        //creating monsters on x axis between 0,640 coordinates randomly
        this.x = Phaser.Math.Between(0,640);
        this.depth = 1; //monster will always be above background
        this.speed = Phaser.Math.Between(2,10); //random speed for monster between 2 and 10

        scene.add.existing(this);   //Ask the scene to add the monster drawing to it self
        scene.physics.add.existing(this);   //ask the scene to add monster physics
    }

    move(){
        this.y -=this.speed;        //handles how monster move, this case decrement y coordinate by speed so monster move up
    }
}