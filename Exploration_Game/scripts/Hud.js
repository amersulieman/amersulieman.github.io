//A class that controls the messages to be displayed to the screen
class Hud extends Phaser.GameObjects.Text
{
    //class constructor
    constructor(scene){
        super (scene, scene.view_width/2,0,'');//centers the test to the middle of the scene size
        //Info about the text such as color and so on
        this.setStyle({color:'#ff0000',fontSize:25,fontFamily:"SignPainter",align:"center"});
        this.depth =2;  //gives it higher value so it appears on top
        this.setOrigin(0.5,0);
        this.setScrollFactor(0,0);

        scene.add.existing(this);
        this.scene=scene;
        this.is_message = false;//value to check if the item has a message
        this.is_story =false;

        this.storylines ={
            1:"The rules are simple!\nFind your keys to unlock the doors for your weapons\nThen kill the monsters and save the queen!\n",
            2:"Grab your weapon up north and kill that creature!\n Then find your second key to dfind your second weapon!\n",
            3:"Use your weapon to kill the dragons\n and the creature in the front to open the doors for hell!\n",
            4:"Find the key to the demon door!\nThen find your sword to kill him.\nThen save the queen!\n"

        };
    }

    //helper method that shows the message
    show_message(message){
        this.is_message =true;  //turn boolean value true
        this.setText(message);  //sets the text to be presented
        //text stays up for 3.5 seconds and then use an anonymous function to set boolean value false.
        this.scene.time.delayedCall(3500,function(){this.is_message=false},[],this);
    }

    //helper method that shows a story
    show_story(player,helpers){
        this.is_story=true;
        let story = this.storylines[helpers.story_id];
        this.setText(story);
    }
    //helper method to hide the text after the boolean value was sat false/ a clever way to hide a message
    hide(){
        if(this.is_message==false && this.is_story == false){
            this.setText("");//sets an empty text so old text would not be shown anymore
        }
        //set the story boolean outside because we want the story to show as long as the player overlap the question mark
        this.is_story= false;
    }

}