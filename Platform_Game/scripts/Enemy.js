//Class that handles the monster info
class Enemy extends Phaser.Physics.Arcade.Sprite
{
    //constructor
    constructor(scene,start){
        //takes scene the enemy will be created and x, y coordinates and the key name of the enemy
        super(scene,0,0,'enemy');
        //'start' will be found in level 1 create_monster() method that will look in tiled map for an object that
        //has a type 'enemy' which we decide to be our start point
        this.enemyStart = start;
        this.x = this.enemyStart.x;//x-coordinate is the same as that 'enemy' object x -coordinate
        this.y = this.enemyStart.y;//y-coordinate is the same as that 'enemy' object y-coordinate

        this.depth = 1; //monster will always be above background
        this.speed = 120;//monster speed

        scene.add.existing(this);   //Ask the scene to add the monster drawing to it self
        scene.physics.add.existing(this);   //ask the scene to add monster physics
        this.body.velocity.x = -this.speed; //move the monster to the left
        this.body.bounce.x = 1;//allow the monster to bounce and come back
    }

    //if monster fell off then relocate it back to where it started
    respawn()
    {
            this.x = this.enemyStart.x;//reset monster x-coordinate
            this.y = this.enemyStart.y;//reset monster y-coordinate
            this.body.velocity.y = 0;   //reset y.velocity to 0

    }

}
