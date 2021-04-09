class Scene1 extends BaseScene{
    constructor(){
        super("level1");

        console.log("Finished child constructor for scene 1")
    }
    preload(){
        // CALL super preload 
        super.preload("mapLevel1","./assets/tilemaps/Level1.json")
    }

    create(){
        // call the super preload
        super.create("mapLevel1")
    }

    update(){

        //call the super update
        super.update()
    }

    kingEscapes(){
        //call the super kingEscapes
        super.kingEscapes("Level2")
    }
}