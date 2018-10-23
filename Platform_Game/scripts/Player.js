/*A class that represent the play and anything associated with it*/
class Player extends Phaser.Physics.Arcade.Sprite
{
    //Constructor takes a scene to which player will be created in
    constructor(scene)
    {
        //Phaser.physics.Arcade.Sprite constructor require scene, x-coordinates,y-coordinates,The key for the player
        super(scene,0,0,'player');
        /*In tiled I created an object and gave it a type 'player' ,So the following looks for the first object only
        in my map that has a type player*/
        let start = scene.map.findObject('items',obj=>obj.type==='player');
        this.x =start.x;            //x will have that start x-coordinate
        this.y = start.y;           //y will have that start y-coordinate
        this.setOrigin(0.5,1);      //the player half will be at the beginning of that player box
        this.depth =1;              //the depth will cause player to be always in front of everything
        this.speed =200;            //the player speed is 200
        scene.add.existing(this);               //ask the scene to add the player into the drawing
        scene.physics.add.existing(this);       //ask the scene to add physics to the player
        this.body.setSize(this.width -16,this.height);  //change the physics for the player body so it fits between tiles because it is really big

        //THE KEYBOARD KEYS WE WILL USE
        this.keys = scene.input.keyboard.addKeys('up,left,right');
        //Call helper method that creates the animations

        //check if the animation have been already created
        if(scene.anims.anims.size==0)
             this.setup_animations(scene);
    }

    //setup the player animations
    setup_animations(scene){
            scene.anims.create({
                key: 'idle',
                frames: scene.anims.generateFrameNumbers('player', {start:0,end:0}),
                frameRate: 6
            });
           scene.anims.create({
               key: 'right',
               frames: scene.anims.generateFrameNumbers('player', {start:6,end:7}),
               frameRate: 4
           });
           scene.anims.create({
               key: 'left',
               frames: scene.anims.generateFrameNumbers('player', {start:8,end:9}),
               frameRate: 6
           });
       }

    //A method that tracks the player moves and what to do for how to move
    move(){
        //string for the animation to be played
        var move_animation = '';
        //verify that the player has a physics body in order to move in the world
        if (this.body === undefined)
            return;

        //reset the player body velocity
        this.body.velocity.x=0; // change x velocity only so y can carry over for gravity

        //if the set has 'ArrowUp' event and the player on the floor or the player on an item then change his y velocity
        //because it means he is going up
        if(this.keys.up.isDown && (this.body.onFloor()||this.body.touching.down)){
            this.body.velocity.y= -this.speed *2;
        }
        //if set has 'ArrowLeft' even then change the player x velocity by negative so he can go to the left
        if(this.keys.left.isDown){
            this.body.velocity.x= -this.speed;
            //using the key that references the animation created to move to the left
            move_animation ='left';
        }
        //if the set has 'ArrowRight' event then change player x velocity by positive so he can go to the right
        if(this.keys.right.isDown){
            this.body.velocity.x= this.speed;
            //using the key that references the animation created to move to the right
            move_animation='right';
        }
        //iF THERE IS AN ANIMATION THEN PLAY IT
        if(move_animation){
            this.anims.play(move_animation,true);
        }
        //if not then play idle animation
        else{
            //set stationary poses
            this.anims.play('idle',true);
        }
    }
}