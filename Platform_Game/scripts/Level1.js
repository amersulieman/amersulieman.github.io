/* A class that handles most of the game logic that extends phaser.scene to play a scene*/
class Level1 extends Phaser.Scene
{
    //constructor that takes key level1 as a default if no parameter was passed
    constructor(key='Level1'){
        super(key);             //passes that key to phaser.scene constuctor
        this.mapKey = 'map';       //variable to store the name of the map.json file

    }

    //load the art assets
    preload(){
        //path for the art assets
        this.load.path= 'assets/';
        //the name of the json file and its key that reference it
        this.load.tilemapTiledJSON(this.mapKey,'map.json');
        //Name of the png file that hold the tiles, uploaded as an image
        this.load.image('tiles','tiles.png');
        //player uploaded as a spritesheet with its frame width and height, also physics will be added to it later
        this.load.spritesheet('player','playerFinal.png',{frameWidth:64,frameHeight:64});
        this.load.image('enemy','dragon.png');      //load the monster as an image
        //items are uploaded as a sprite sheet as well which means physics will be added to them to interact with player
        this.load.spritesheet('itemMap','items.png',{frameWidth:32,frameHeight:32});
    }

    //create the game
    create(){
        //console.log(this.map);
        this.create_map();                      //helper method to create the map
        this.player = new Player(this);         //create the player from its own class
        //this.children.add(this.player);       //We can ask the scene to add player as its child
        this.create_monsters();
        this.setup_camera();                    //helper method that sets up the camera
        this.create_objects();                  //helper method that create the items as objects
        this.setup_physics();                   //Give items their physics and what happens if player collide
    }

    //Helper method to create the map
    create_map(){
        this.map = this.make.tilemap({key:this.mapKey});               //make the map
        //add the tiles to the map from tiles.png but referenced by its key name
        let groundTiles = this.map.addTilesetImage('tiles');
        //create these tiles as a static layer because they don't need gravity
        this.groundLayer = this.map.createStaticLayer('tiles',groundTiles);
        //In tiled we sat some tiles with costume property "terrain" and gave it "block"
        //Any tile with that terrain then the player can collide with
        this.groundLayer.setCollisionByProperty({terrain:['block']});
    }
    //helper method that sat up the camera
    setup_camera(){
        this.cameras.main.startFollow(this.player);     //Set the camera to follow the player
        //set the camera bounds not to fall off the map size
        this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
        //set the background to a specific color
        this.cameras.main.setBackgroundColor('#ccccff');

    }

    //method that gives initialize physics and physics properties
    setup_physics(){
        //set the physics bounds width to the ground layer width
        this.physics.world.bounds.width = this.groundLayer.width;
        //set the physics bounds height to the ground layer height
        this.physics.world.bounds.height =this.groundLayer.height;
        //add physics that the player and the the block tiles collide with each other
        this.physics.add.collider(this.player,this.groundLayer);
        //add physics that the monster and the ground tiles collide
        this.physics.add.collider(this.groupMonsters,this.groundLayer);
        //add physics that the monster and the spikes collide
        this.physics.add.collider(this.groupMonsters,this.groupSpikes);
        this.physics.add.collider(this.groupMonsters,this.groupBricks);

        //if the player collide with coins, call coin_take method and pass in player as 1st param and groupCoins as 2nd param
        this.physics.add.overlap(this.player,this.groupCoins,this.coin_take,null,this);
        //if player overlap the spikes then call game_over method, pass in player as 1st param and groupSpikes as 2nd param
        this.physics.add.overlap(this.player,this.groupSpikes,this.game_over,null,this);
        //if player collide with the bricks then call add gravity so the bricks can fall
        this.physics.add.collider(this.player,this.groupBricks,this.add_gravity,null,this);
        //if player overlap the goal item, the call method new_scene
        this.physics.add.overlap(this.player,this.goal,this.new_scene,null,this);
        //if monster overlap the player then call attack method to see if player loses or kill monster
        this.physics.add.overlap(this.player,this.groupMonsters,this.attack,null,this);

    }

    /*Method that create those items as objects into the game, When createFromObjects() used, it looks for the object
        by the name, that is why we give those items names in Tiled*/
    create_objects(){
        /*Create object 'coin' from layer 'items' in Tiled from file 'items.png' that is referenced using key 'itemMap',
         frame: 3 is the Id of that coin sprite in Tiled*/
        this.groupCoins =this.map.createFromObjects('items','coin',{key:'itemMap',frame:3});
        /*Create object 'brick' from layer 'items' in Tiled from file 'items.png' that is referenced using key 'itemMap',
        frame: 9 is the Id of that brick sprite in Tiled*/
        this.groupBricks =this.map.createFromObjects('items','brick',{key:'itemMap',frame:9});
        /*Create object 'spikes' from layer 'items' in Tiled from file 'items.png' that is referenced using key 'itemMap',
         frame: 4 is the Id of that brick sprite in Tiled*/
        this.groupSpikes = this.map.createFromObjects('items','spikes',{key:'itemMap',frame:4});
        /*Create object 'goal' from layer 'items' in Tiled from file 'items.png' that is referenced using key 'itemMap',
          frame: 1 is the Id of that brick sprite in Tiled*/
        this.goal = this.map.createFromObjects('items','goal',{key:'itemMap',frame:1});
        //call helper method to give those objects their physics properties
        this.setup_objects(this.goal);
        this.setup_objects(this.groupBricks);
        this.setup_objects(this.groupCoins);
        this.setup_objects(this.groupSpikes);
    }

    //Give each group object passed a physics property to all of its children
    setup_objects(objGroup){
        //for every object in a specific group
        for(var obj of objGroup){
            //Add the physics to that object
            this.physics.add.existing(obj);
                //make it immovable when the player collide with it, When you collide you don't want the objects to slide away
                obj.body.immovable = true;
                //Don't allow gravity so those objects do not fall off the map
                obj.body.allowGravity = false;
        }
    }

    /*A method that plays the next scene("level") when the player specific condition is met. The parameters are used
     so when we use the overlap method in setup_physics we can specific what things overlap*/
    new_scene(player,goal){
        //Start Level2 which is a separate class
       this.scene.start('Level2');
    }

    /*game over to restart the scene when the player loses, The parameters are used so when we use the overlap method in
     setup_physics to specific which two things overlap. The are sat to null for a default parameter, but will change if
     overlap method is called*/
    game_over(player=null,hazard=null){
        /*If the player height(y) is greater than the map height then he fell and should lose, The reason it is greater
        is because pixels grow downward*/
        if(this.player.y > this.map.heightInPixels){
                this.scene.restart();
        }
        /*if the parameter stayed null that means nothing overlapped, so if this method is called , it will be called
            because the player lost by overlapping something or other condition because we are restarting the scene
            any time this method is called, whether someone collided or for any other reason! The result of calling this
            will be restarting the scene*/
        if (hazard !== null)
        {

               this.scene.restart();

        }
    }

    //destroy the sprite sheet coin when the player overlap with the coin so it looks like he took it
    coin_take(player,coin){
        coin.destroy();                 //Destroy the coin sprite
    }

    //helper method that handles creating multiple monsters
    create_monsters()
    {
        this.groupMonsters = [];    //Array that will hold monsters created
        //find all the objects with the type  'enemy' which is placed in tiled
        let enemyTiles = this.map.filterObjects('items', (obj) => obj.type==='enemy');
        //for loop to look for every tile that had that object with type 'enemy'
        for (let tile of enemyTiles)
        {
            //create an object or dictionary
            let enemy_config = {};
            enemy_config['x'] = tile.x; //create an 'x' value in the dictionary and its value going to be the enemy tile x-coordinate
            enemy_config['y'] = tile.y  //create a 'y' value in the dictionary and its value going to be the enemy tile y-coordinate
            let monster = new Enemy(this,enemy_config );    //then create monster from monster class and give it the scene and the start object
            this.groupMonsters.push( monster ); //add each monster to the array groupMonsters
        }

    }

    //if enemy fall off then i will respawn to its original location
    respawn_enemy(){
        //for every enemy in the enemy array
        for (let enemy of this.groupMonsters)
        {
            //if the enemy y coordinate is larger than the map y coordinate then call the respawn method in enemy
            if(enemy.y > this.map.heightInPixels){
                enemy.respawn();    //respawn method in enemy resets the monster location
            }
        }
    }

    //method that will allow gravity so the bricks can fall
    add_gravity(player,hazard){
        //give brick gravity negative number so takes time to fall so player doesn't fall through
        //and the player can jump after hitting the brick
        hazard.body.gravity.y = -1;
        hazard.body.allowGravity = true;

    }

    attack(player,monster){
        //if player is touching something under it then it means he's stepping on monster so kill it,
        //this is important because player to kill monster needs to jump on it , not overlap it from side
        if(player.body.touching.down){
            monster.destroy();
            this.cameras.main.flash();
        }
        else{
            this.game_over(player,monster);//call g
        }
    }

    //keep updating player movement
    update(){
        this.player.move();         //keeps checking if player moved and knows what to do
        this.game_over();           //keeps checking the conditions of the player if to die or not
        this.respawn_enemy();       //method to respawn the enemy
    }
}