class Scene2 extends BaseScene{
    constructor(){
        super("Level2");

        console.log("Finished child constructor for scene 2")
    }
    preload(){
        // CALL super preload 
        console.log("preload")
        super.preload("mapLevel2","./assets/tilemaps/Level2.json")

        //load our level 2 sound
        this.load.audio("audio_chipmunk","assets/sounds/angry_chipmunk.mp3")
    }

    create(){
        // call the super preload
        super.create("mapLevel2")

         // configure and start level two sound
        this.levelMusic = this.sound.add("audio_chipmunk");

        let musicConfig = {
            mute:false,
            volume: 0.2,
            rate: 1,
            detune: 0,
            loop: true,
            delay: 0
        };

        //start the level sound
        this.levelMusic.play(musicConfig)
    }

    update(){

        //call the super update
        super.update()
    }

    kingEscapes(){

        //Stop the level sound
        this.levelMusic.stop()
        
        //call the super kingEscapes
        super.kingEscapes(null)
    }
}