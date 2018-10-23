class Player extends Phaser.Physics.Arcade.Sprite
{
    //Constructor takes a scene as a parameter to which scene the player will be loaded
    constructor(scene){
        //phaser.physics.arcade.sprite constructor takes 4 params
        //the scene, the x and y coordinates and the name of the sprite sheet.
        super(scene,0,0,'player');
        let start = scene.map.findObject('items',obj=>obj.type ==='start');
        this.x=start.x;              //x coordinate where the player starts
        this.y=start.y;             // y coordinates where the player starts
        this.depth=1;
        this.speed=200;             // speed of the player movement
        this.monsters;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.arrowkeys = new Set(); //create a new set to add or delete when a key is pressed
        this.weaponSet = new Set(); //set that holds all weapons
        scene.input.keyboard.on('keydown', this.updateArrowKeys,this);
        scene.input.keyboard.on('keyup', this.updateArrowKeys,this);

        this.setup_animations(scene);

    }

    //helper method that checks for what event is happening
    updateArrowKeys(event){
        //'keydown' is a prebuilt in string, when it occurs it means one of the keys is pressed
        if(event.type === 'keydown'){
            this.arrowkeys.add(event.key);
        }
        //'keyup' is also a prebuilt in string which it means that key is not pressed anymore
        else if(event.type === 'keyup'){
            this.arrowkeys.delete(event.key);
        }

    }

    //setup the player animations
    setup_animations(scene){
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('player', {start:0,end:1}),
            frameRate: 3
        });
        scene.anims.create({
            key: 'down',
            frames: scene.anims.generateFrameNumbers('player', {start:2,end:3}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'up',
            frames: scene.anims.generateFrameNumbers('player', {start:4,end:5}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('player', {start:6,end:7}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('player', {start:8,end:9}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'idleSword',
            frames: scene.anims.generateFrameNumbers('player', {start:10,end:11}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'downSword',
            frames: scene.anims.generateFrameNumbers('player', {start:12,end:13}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'upSword',
            frames: scene.anims.generateFrameNumbers('player', {start:14,end:15}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'rightSword',
            frames: scene.anims.generateFrameNumbers('player', {start:16,end:17}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'leftSword',
            frames: scene.anims.generateFrameNumbers('player', {start:18,end:19}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'idleAxe',
            frames: scene.anims.generateFrameNumbers('player', {start:20,end:21}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'downAxe',
            frames: scene.anims.generateFrameNumbers('player', {start:22,end:23}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'upAxe',
            frames: scene.anims.generateFrameNumbers('player', {start:24,end:25}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'rightAxe',
            frames: scene.anims.generateFrameNumbers('player', {start:26,end:27}),
            frameRate: 6
        });
        scene.anims.create({
            key: 'leftAxe',
            frames: scene.anims.generateFrameNumbers('player', {start:28,end:29}),
            frameRate: 6
        });
    }
    //handles the weapon pick up, In tiled i gave each weapon a monster_id which is how many monsters can the weapon eliminate
    weapon_handling(player,weapon){
        this.monsters = weapon.monster_id;
          if ('knife_id' in weapon){//check if weapon has knife_id
            this.weaponSet.add(weapon.knife_id); //Add the weapon to the weapon set
            weapon.destroy();                    //destroy the sprite weapon
        }
    }
    //handles how to destroy the monster,Each weapon has a knife_id and so is the monster, so the weapon knife_id that
    //matches the monster's knife_id then that weapon can eliminate that monster
    monster_handling(player,monster){
        //Check if the weapon set contain the knife_id that the monster has, which checks if the weapon set contain a weapon
        // with a knife_id that match the monster knife_id
        if(this.weaponSet.has(monster.knife_id)){
            this.monsters-=1;//decrement the variable monster in case if a weapon can kill multiple monsters
            monster.destroy();  //destroy the sprite for that monster
            //if the monster variable is 0 then that weapon killed all the monsters that it can kill
            if(this.monsters==0){
                //Then delete the weapon from the set
                this.weaponSet.delete(monster.knife_id)
            }
         }
        else{
            //if player didn't have the weapon then the player loses
            this.scene.game_over();
        }
    }
    //move helper method that decides what to do when an event occurs in the set
    move(){
        //reset the velocity of the player
        this.body.velocity.x=0;
        this.body.velocity.y=0;
        var move_animation ='';     //variable will be used to check which animation to play

        //manipulate character movement
        //'ArrowUp' , 'ArrowDown', 'ArrowLeft', 'ArrowRight' are all pre built in string events
        //Four events that might happen are the arrow keys being pressed which are 4 of them
        if(this.arrowkeys.has('ArrowUp')){
            //if the Up arrow is pressed it means move player up so I decrease its velocity.y
            this.body.velocity.y= -this.speed;
            //conditions for animations
            //if set has 1 or 2 and there are monsters then use the axe animation for moving up
            if((this.weaponSet.has(1)||this.weaponSet.has(2))&&this.monsters!=0){
                move_animation = 'upAxe';
            }
            //if the set has 3 then play the sword up animation
            else if(this.weaponSet.has(3)&&this.monsters!=0){
               move_animation = 'upSword';
            }

            //else play normal animation going up
            else{
                move_animation = 'up';
            }
        }

        if(this.arrowkeys.has('ArrowDown')){
            //if the down arrow is pressed it means move player down so I increase its velocity.y
            this.body.velocity.y= this.speed;
            if((this.weaponSet.has(1)||this.weaponSet.has(2))&&this.monsters!=0){
                move_animation = 'downAxe';
            }else if(this.weaponSet.has(3)&&this.monsters!=0){
               move_animation = 'downSword';
            }else{
                move_animation = 'down';
            }
        }
        if(this.arrowkeys.has('ArrowLeft')){
            //if the left arrow is pressed it means move player left so I decrease its velocity.x
            this.body.velocity.x= -this.speed;
            if((this.weaponSet.has(1)||this.weaponSet.has(2))&&this.monsters!=0){
                move_animation = 'leftAxe';
            }else if(this.weaponSet.has(3)&&this.monsters!=0){
               move_animation = 'leftSword';
            }else{
                move_animation = 'left';
            }
        }
        if(this.arrowkeys.has('ArrowRight')){
            //if the right arrow is pressed it means move player right so I increase its velocity.x
            this.body.velocity.x= this.speed;
            if((this.weaponSet.has(1)||this.weaponSet.has(2))&&this.monsters!=0){
                move_animation = 'rightAxe';
            }else if(this.weaponSet.has(3)&&this.monsters!=0){
               move_animation = 'rightSword';
            }else{
                move_animation = 'right';
            }
        }
        if(move_animation){
            this.anims.play(move_animation,true);
        }
        else{
            if((this.weaponSet.has(1)||this.weaponSet.has(2))&&this.monsters!=0){
                this.anims.play('idleAxe',true);
            }else if(this.weaponSet.has(3)&&this.monsters!=0){
                this.anims.play('idleSword',true);
            }else{
                this.anims.play('idle',true);
            }
        }
    }
}