//Class that handles anything that deals with the player

class Player extends Phaser.Physics.Arcade.Sprite
{
    //constructor gets passed which scene the player will be created at
    constructor(scene){
        //pass in the scene the player will be created at , the x and y coordinates will start and player key name
        super(scene,300,200,'player');
        this.depth =1;      //sat to 1 so the player can be above the background all time
        this.speed =200;    //player speed

        scene.add.existing(this);           //asks the scene to ad the drawing of the player to itself
        scene.physics.add.existing(this);   //Ask the scene to add the player physics
        this.setCollideWorldBounds(true);   //keep scope sat to the map, never leave the map

        this.arrowKeys = new Set();         //A set that will control the keyboard events
        //When the keyboard is pressed 'keydown' then call the method updateArrowKeys
        scene.input.keyboard.on('keydown',this.updateArrowKeys,this);
        //If the button is not pressed anymore then call the method updateArrowKeys
        scene.input.keyboard.on('keyup',this.updateArrowKeys,this);

    }

    //event handler of the keys being pressed
    updateArrowKeys(event){
        if(event.type === 'keydown')                //if the event is 'keydown' then add that key to the set
            this.arrowKeys.add(event.key);
         else if (event.type ==='keyup')            //if the event is 'keyup' then delete that key from the set
            this.arrowKeys.delete(event.key);
    }

    move(){
        this.body.velocity.x = 0;                   //reset the velocity x of the player
        this.body.velocity.y = 0;                   //reset the velocity y of the player

        /*if the set has "ArrowUp" it means the up arrow was pressed and then decrease the y velocity of the player
          so he can move up*/
        if(this.arrowKeys.has("ArrowUp")){
            this.body.velocity.y = -this.speed;
        }
        /*if the set has "ArrowDown" it means the down arrow was pressed and then increase the y velocity of the player
          so he can move down*/
        if(this.arrowKeys.has("ArrowDown")){
            this.body.velocity.y = this.speed;
        }
        /*if the set has "ArrowLeft" it means the left arrow was pressed and then decrease the x velocity of the player
          so he can move left*/
        if (this.arrowKeys.has("ArrowLeft")){
            this.body.velocity.x = -this.speed;
        }
        /*if the set has "ArrowRight" it means the right arrow was pressed and then increase the x velocity of the player
          so he can move right*/
        if(this.arrowKeys.has("ArrowRight")){
            this.body.velocity.x = this.speed;
        }
    }
}