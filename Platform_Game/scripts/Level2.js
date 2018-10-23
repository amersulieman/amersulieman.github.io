/* A class that will be responsible for the second level which instantiate the firs level
    because we only would like to change the map*/
class Level2 extends Level1
{
    //constructor calls level one constructor but pass in level2 because default type is level one
   constructor(){
        super('Level2');
        this.mapKey ='map2';   //key to reference level2
   }

    //override the method preload because we are loading a different map
    preload(){
           this.load.path= 'assets/';   //same path
           this.load.tilemapTiledJSON(this.mapKey,'map2.json');//different map file
       }

           /*A method that plays the next scene("level") when the player specific condition is met. The parameters are used
            so when we use the overlap method in setup_physics we can specific what things overlap*/
           new_scene(player,goal){
               //Start Level2 which is a separate class
              this.scene.start('Level3');
           }
}