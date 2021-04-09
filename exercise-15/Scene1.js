class Scene1 extends BaseScene{
    constructor(){
        super("level1");

        console.log("Finished child constructor for scene 1")
    }
    preload(){
        // CALL super preload 
        super.preload("mapLevel1","./assets/tilemaps/Level1.json")
        
        //load our level 1 sound
        this.load.audio("audio_crowd","assets/sounds/angry_crowd.mp3")
    }

    create(){
        // call the super preload
        super.create("mapLevel1")
        // configure and start level one sound
        this.levelMusic = this.sound.add("audio_crowd");

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
        super.kingEscapes("Level2")
    }
}