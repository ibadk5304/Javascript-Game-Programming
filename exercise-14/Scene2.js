class Scene2 extends BaseScene{
    constructor(){
        super("Level2");

        console.log("Finished child constructor for scene 2")
    }
    preload(){
        // CALL super preload 
        console.log("preload")
        super.preload("mapLevel2","./assets/tilemaps/Level2.json")
    }

    create(){
        // call the super preload
        super.create("mapLevel2")
    }

    update(){

        //call the super update
        super.update()
    }

    kingEscapes(){
        //call the super kingEscapes
        super.kingEscapes(null)
    }
}