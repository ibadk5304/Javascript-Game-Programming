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
                debug: true
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }

    };

    let game = new Phaser.Game(config)

    function preload(){
        //preload all the tile set 
        this.load.image('dungeon_barrels', 'assets/tilesets/Barrels/Barrels.png');
        this.load.image('dungeon_bookcases', 'assets/tilesets/Bookcases/Bookcases.png');
        this.load.image('dungeon_carpets', 'assets/tilesets/Carpets/Carpets.png');
        this.load.image('dungeon_columns', 'assets/tilesets/Columns/Columns.png');
        this.load.image('dungeon_floors', 'assets/tilesets/Floors/Floors.png');
         this.load.image('dungeon_props', 'assets/tilesets/Props/Props.png');
        this.load.image('dungeon_stairs', 'assets/tilesets/Stairs/Stairs.png');       
        this.load.image('dungeon_walls', 'assets/tilesets/Walls/Walls.png');
        
        //preload the map

        this.load.tilemapTiledJSON('map','./assets/tilemaps/Level1.json')
    }

    function create(){
        //create the map

        const map = this.add.tilemap("map");

        // add the tilesets to the map -- not using columns and stairs at present
        const tileset1 = map.addTilesetImage("Barrels", "dungeon_barrels")
        const tileset2 = map.addTilesetImage("Bookcases", "dungeon_bookcases")
        const tileset3 = map.addTilesetImage("Carpets", "dungeon_carpets")
        const tileset4 = map.addTilesetImage("Floors", "dungeon_floors")
        const tileset5 = map.addTilesetImage("Props", "dungeon_props")
        const tileset6 = map.addTilesetImage("Walls", "dungeon_walls")

        // add the map layer to the scene

        const floorLayer= map.createLayer("Floors",[tileset4],0,0);
        const carpetLayer= map.createLayer("Carpets",[tileset3],0,0);
        const foundationLayer= map.createLayer("Foundations",[tileset6],0,0);
        const propLayer= map.createLayer("Props",[tileset5],0,0);
        const bookcaseLayer= map.createLayer("Bookcases",[tileset2],0,0);
        const barrelLayer= map.createLayer("Barrels",[tileset1],0,0);

        // set the camera's start position so we are in the map

        this.cameras.main.scrollX= 600;
        this.cameras.main.scrollY=600;

        //turn on the cursor keys so we can pan around the map

        this.cursors = this.input.keyboard.createCursorKeys()

    }

    function update(){

        //move the camera around the map based on keypress

        if(this.cursors.up.isDown) //North direction
        {
            this.cameras.main.scrollY -= 10;
        }
        else if(this.cursors.down.isDown) //South direction
        {
            this.cameras.main.scrollY += 10;
        }
          else if(this.cursors.right.isDown) //East direction
        {
            this.cameras.main.scrollX += 10;
        }
          else if(this.cursors.left.isDown) //West direction
        {
            this.cameras.main.scrollX -= 10;
        }
    }
   

})()