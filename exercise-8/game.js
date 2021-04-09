


// window.onload= function(){
    
//     var gameSettings ={
//         playerSpeed: 200
//     }
//     var config = {
//          width: 256,
//         height: 272,
//         backgroundColor: 0x000000,
//         scene: [Scene1, Scene2],    
//         pixelArt: true,
//         physics: {
//             default: "arcade",
//             arcade:{
//                 debug:false,
//                 debugShowVelocity: false
//             }
//         }

//     }
//     var game= new Phaser.Game(config);

//     window.config = config;
//     window.game = game;
//     window.gameSettings = gameSettings;
// }

//I think the abobe window declaration blocking the power up
var gameSettings = {
  playerSpeed: 200,
  maxPowerups: 2,
  powerUpVel: 50,
}

var config = {
  width: 256,
  height: 272,
  backgroundColor: 0x000000,
  scene: [Scene1, Scene2],
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade:{
        debug: false,
        debugShowVelocity: false
    }
  }
}


var game = new Phaser.Game(config);
