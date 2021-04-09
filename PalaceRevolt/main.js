// IIFE - Script at bottom

(function(){
    //put our code her

    //set our game config
    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: "#2d2d2d",
        parent:"place-revolt",
        pixelArt: true,
        physics : {
            default:"matter",
            matter:{
                gravity: { y:0 },
                debug: false
            }
        },
        scene: [Scene1, Scene2]

    };

    let game = new Phaser.Game(config)
   

})()