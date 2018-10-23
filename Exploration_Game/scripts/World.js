class World extends Phaser.Scene
{
    //constructor for a new scene
    constructor(){
        //set the scene's id within the super class constructor, which we inherited from phaser.scene
        super('world');
        this.tile_size= 64; //The tile size that I have used
        this.view_width  = 8 * this.tile_size;//width of text
        this.view_height = 8 * this.tile_size;//ehight of text
    }
    //preload external game assets which will be in the Assets directory
    preload(){
        this.load.path ='Assets/';                                   //The path for the file
        //Here I am giving the json file a key or name that we can use to reference later if we need to
        this.load.tilemapTiledJSON('newMap','newMap.json');         //load json file which is the map
        this.load.image('tiles','tiles.png');                       //load tile images
        this.load.spritesheet('player','playerFinal.png',{frameWidth: 64, frameHeight: 64}); //load sprite sheet
        //weapons is the name of the png file that contains weapons and keys
        this.load.spritesheet('tilemap','weapons.png',{frameWidth:64,frameHeight:64});//load items to be objects later
        this.load.spritesheet('tilemap2','helping.png',{frameWidth:64,frameHeight:64});//load items to be objects later
        this.load.spritesheet('tilemap3','tiles.png',{frameWidth:64,frameHeight:64});//load items to be objects
        this.load.spritesheet('tilemap4','enemies.png',{frameWidth:64,frameHeight:64});//load items to be objects
    }
   
    //create game data
    create(){
        this.create_map();          //create level
        this.player=new Player(this);   //create the player
        this.setup_camera(); //call helper method that sets up the camera
        this.create_object();//helper method call to create these objects
        this.hud = new Hud(this); //create message class and give it current scene
        this.setup_physics();

    }
    //load level
    create_map(){
        this.map = this.make.tilemap({key:'newMap'});   //set up map object from tilemap
        let tiles = this.map.addTilesetImage('tiles');  //add tileset images into the map object
        //1st param: name of tileset from Tiled, 2nd param: tileset image from preload.
        this.layer = this.map.createStaticLayer('tiles',tiles);

        //collisions based on properties such as tile terrain in costume properties
        //the custome propeties are given in Tiled when the map was created
        this.layer.setCollisionByProperty({terrain:['rock','tree','fire','wall','door','water']})
    }

    //setup the camera to follow the player
    setup_camera(){
        this.cameras.main.startFollow(this.player); //camera follows the player
        //camera bounds are sat so it doesn't fall off of our map scope.
        this.cameras.main.setBounds(0,0,this.map.widthPixels,this.map.heightInPixels);
    }

    //create items from object layer
    create_object(){
        //'items' is the layer type used when the objects were inserted in the tiled map
        //'key' is the object name i used in tild for the keys
        //'tilemap' is a reference name from preload method to load the file
        //frame 2 is the Id for that object in the file weapons
        this.keys= this.map.createFromObjects('items','key',{key:'tilemap',frame:2});
        this.helpers = this.map.createFromObjects('items','helping',{key:'tilemap2',frame:0});
        this.weapons1 = this.map.createFromObjects('items','sword',{key:'tilemap',frame:0});
        this.weapons = this.map.createFromObjects('items','weapon',{key:'tilemap',frame:1});
        this.door =this.map.createFromObjects('items','door',{key:'tilemap3',frame:13});
        this.monsters=this.map.createFromObjects('items','monster',{key:'tilemap4',frame:0});
        this.monsters2=this.map.createFromObjects('items','monster2',{key:'tilemap4',frame:3});
        this.monsters1=this.map.createFromObjects('items','monster1',{key:'tilemap4',frame:4});
        this.monsters3=this.map.createFromObjects('items','monster3',{key:'tilemap4',frame:6});

        //method that add physics to the items(objects) created
        this.setup_object('door',this.door);
        this.setup_object('key',this.keys);
        this.setup_object('helping',this.helpers);
        this.setup_object('weapon',this.weapons);
        this.setup_object('sword',this.weapons1);
        this.setup_object('monster',this.monsters);
        this.setup_object('monster1',this.monsters1);
        this.setup_object('monster2',this.monsters2);
        this.setup_object('monster3',this.monsters3);


    }

    //add physics to the objects
    setup_object(name, objGroup){
        for(var obj of objGroup){
            this.physics.add.existing(obj);
            obj.body.immovable =true;
        }

        //ADD special properties to objects in group from object layer
        var groupProps =this.map.filterObjects('items',(obj)=> obj.name === name);
        for(var index in objGroup){
            //assign the properties into this object
            Object.assign(objGroup[index], groupProps[index].properties);
        }
    }
    //game over method that will restart the scene so it can be called in player
    game_over(){
        //shake the camera
        this.cameras.main.shake(200);
        // fade camera but delay the call a little so the camera can shake first
        this.time.delayedCall(150, function() {
          this.cameras.main.fade(250);
        }, [], this);

        // restart game, Also delay the call so the camera fades first then restart the scene
          this.time.delayedCall(500, function() {
            this.scene.restart();
          }, [], this);
    }
    //pick up a key
    key_take(player,key){
        if('key_id' in key){                //if the key has a key_id
            this.door_open(key.key_id);     //then open the door
        }
        if('message' in key){
            this.hud.show_message(key.message);
        }
        key.destroy(); //destroys the object so it looks like the player took the key
    }
    //open door with a key
    door_open(key_id){
        //loop through all doors and remove an that macth the id of the key
        for(var door of this.door){
            if(door.key_id ==key_id){
                door.destroy();
            }
        }
    }
    //helper method for setting up the physics
    setup_physics(){
        this.physics.add.collider(this.player,this.layer); //add that the player and layer collide
        this.physics.add.collider(this.player,this.door);
        this.physics.add.overlap(this.player,this.keys,this.key_take,null,this);
        //When the player overlap the helpers(question marks) then show_story() handles the rest
        this.physics.add.overlap(this.player,this.helpers,this.hud.show_story,null,this.hud);
        this.physics.add.overlap(this.player,this.weapons,this.player.weapon_handling,null,this.player);
        this.physics.add.overlap(this.player,this.weapons1,this.player.weapon_handling,null,this.player);
        this.physics.add.overlap(this.player,this.monsters,this.player.monster_handling,null,this.player);
        this.physics.add.overlap(this.player,this.monsters1,this.player.monster_handling,null,this.player);
        this.physics.add.overlap(this.player,this.monsters2,this.player.monster_handling,null,this.player);
        this.physics.add.overlap(this.player,this.monsters3,this.player.monster_handling,null,this.player);


    }

    //update game data
    update(){
        this.player.move(); //keeps checking the set if it has an event and what to do with it
        this.hud.hide();
    }
}