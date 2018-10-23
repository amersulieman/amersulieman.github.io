//Class that controls the game world and everything else
class PlayScene extends Phaser.Scene
{
    //constructor
    constructor(){
        super('play');
        this.score=0;
        this.topScore =0;
    }

    //load the art assets
    preload(){
        //path for the art assets
        this.load.path ='assets/';
        //Name of the png file that hold the tiles, uploaded as an image
        this.load.image('background', 'background.png');
        //player uploaded as an image
        this.load.image('player', 'player.png');
        //enemy uploaded as an image
        this.load.image('enemy','dragon.png');

    }

    //create the game
    create(){
        this.create_map();              //helper method to create the map
        this.player = new Player(this); //create the player from its own class
        this.create_objects();          //helper method that create the items/specific things as objects
        this.setup_physics();           //Give items their physics and what happens if player collide
        this.setup_hud();
    }

    //Helper method to create the map
    create_map(){
        this.add.image(640/2, 480/2, 'background');
    }

    //creates the enemies as objects
    create_objects(){
        //Add enemies to physics group
        this.enemies = this.physics.add.group();

        //create monsters with a time between each call
        this.time.addEvent({
            delay:400,
            callback: function() {this.enemies.add(new Enemy(this) ) },
            callbackScope: this,
            loop: true
        }, this);
    }

    //When player overlap with enemies then call game_over(),Give player as 1st param and enemies as 2nd param
    setup_physics(){
        this.physics.add.overlap(this.player,this.enemies,this.game_over,null,this);
    }

    //game over method that restarts the scene as of the losing condition met
    game_over(player,enemy){
        this.scene.restart();
        this.score=0;
    }

    //Game update method that keeps looping! Updates the player moves and the enemy creation
    update(){
        this.player.move();             //Calls the player
        this.enemies.children.iterate(function(enemy){enemy.move()});   //update the monster movement
        this.update_Score();
    }

    update_Score(){
        this.scoreText.setText("Score: " + this.score);
        this.topScoreText.setText("Top Score: " + this.topScore);
        if(this.score >= this.topScore){
            this.topScore = this.score
        }
    }

    setup_hud(){
        this.timeEvent = this.time.addEvent({ 
                delay: 300,
                callback: function(){ this.score++ }, 
                callbackScope: this, 
                loop: true });
        this.scoreText =this.add.text(32,32,this.score);
        this.scoreText.depth = 3;
        this.topScoreText = this.add.text(600,32,this.topScore);
        this.topScoreText.depth = 3;
        this.topScoreText.setOrigin(1,0);
    }

}