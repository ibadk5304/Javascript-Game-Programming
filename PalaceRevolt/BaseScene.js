class BaseScene extends Phaser.Scene{
    
    //static vars for character speeds and score
    static KING_SPEED = 10;
    static MINION_SPEED = 5;
    static MINION_SCORE = 10;
    static BLACKKNIGHT_SPEED = 6;
    static BLACKKNIGHT_SCORE = 50;
    static EVILPRINCE_SPEED = 7;
    static EVILPRINCE_SCORE = 100;

    // static for game scrool
    static CURRENT_SCORE = 0;

    //static var for game pause
    static gamePaused = false;

    //static var for checking if character sprites already preloaded
    static charactersLoaded = false;
    
    constructor(sceneName){
        super(sceneName)

        this.sceneName = sceneName;

        this.nextKingIdle = "king-idle-back";
        console.log("Finished parent constructor for BaseScene")
    }

    preload(mapKey, mapFile){

        //call our loading screen function
        this.playLoadingScreen()

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

        this.load.tilemapTiledJSON(mapKey, mapFile)

        // preload the character spritesheet if not already preloading

        if(!BaseScene.charactersLoaded)
        {
            this.load.multiatlas('character_sprites', './assets/spritesheets/characters/Characters.json',
                './assets/spritesheets/characters');
            this.load.multiatlas('projectile_sprites', './assets/spritesheets/projectiles/projectiles.json',
                './assets/spritesheets/projectiles');

            BaseScene.charactersLoaded = true;
        }

        // preload our EVENT sounds
        this.load.audio("audio_fireball","assets/sounds/fireball.mp3");
        this.load.audio("audio_explosion","assets/sounds/explosion.mp3")
        this.load.audio("audio_game_over","assets/sounds/game_over.mp3")
        
    }

    create(mapKey){
        //create our sounds first
        this.fireballSound = this.sound.add("audio_fireball");
        this.explosionSound = this.sound.add("audio_explosion");
        this.gameOverSound = this.sound.add("audio_game_over");

        //create the map

        const map = this.add.tilemap(mapKey);

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

        // this.cameras.main.scrollX= 600;
        // this.cameras.main.scrollY=600;

        //turn on the cursor keys so we can pan around the map

        this.cursors = this.input.keyboard.createCursorKeys()

        // add the spacebar key to fire fireballs
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // create the king 
        this.king = this.matter.add.sprite(500,1400,'character_sprites','king-back-0.png');
        this.king.setName("king")
        this.king.setScale(2);

        //set my king to not get rotated by collision with collisionzones
        this.king.setBounce(0.2);
        this.king.setFixedRotation();
    
        // set the camera to fallow the king and stay in the map
        // this.cameras.main.setBounds(-(map.widthInPixels / 2), 0, 
        // map.widthInPixels +256, map.heighInPixels + 256);

        this.cameras.main.startFollow(this.king);

        // Would have been great if this worked as matte + phaser + title
        // all get theri isometric act together
        // But in isometric all x and y position of collision zones are nan

        // foundationLayer.setCollisionbyProperty({ collides: true })
        // this.matter.world.convertTilemapLayer(foundationLayer)

        let matterInstance = this.matter;

        //mannually add the collusion zone for foundation
        foundationLayer.forEachTile(function(tile){

            let tileWorldPos = foundationLayer.tileToWorldXY(tile.x,tile.y);
            let collisionGroup = tileset6.getTileCollisionGroup(tile.index);
            if(!collisionGroup || collisionGroup.objects.length === 0)
            {
                return;
            }

            collisionGroup.objects.forEach(function(collisionItem){
                if(collisionItem.rectangle)
                {
                    let objectX = tileWorldPos.x + collisionItem.x + collisionItem.width/2;
                    let objectY = tileWorldPos.y + collisionItem.y + collisionItem.height/2;

                    let tmpSprite = matterInstance.add.sprite(objectX, objectY,"__DEFAULT");

                    //scale sprite and set innovable
                    tmpSprite.setStatic(true);
                    tmpSprite.setDisplaySize(collisionItem.width, collisionItem.height)

                    //check if the current collision zone ist hte escape for this level
                    if(collisionItem.properties && collisionItem.properties.length > 0)
                    {
                        tmpSprite.setName(collisionItem.properties[0].name);
                    }
                }
                else{
                    console.log("unsupported collision item shape!");
                }
            })
        })

         //mannually add the collusion zone for props layer
        propLayer.forEachTile(function(tile){

            let tileWorldPos = propLayer.tileToWorldXY(tile.x,tile.y);
            let collisionGroup = tileset5.getTileCollisionGroup(tile.index);
            if(!collisionGroup || collisionGroup.objects.length === 0)
            {
                return;
            }

            collisionGroup.objects.forEach(function(collisionItem){
                if(collisionItem.rectangle)
                {
                    let objectX = tileWorldPos.x + collisionItem.x + collisionItem.width/2;
                    let objectY = tileWorldPos.y + collisionItem.y + collisionItem.height/2;

                    let tmpSprite = matterInstance.add.sprite(objectX, objectY,"__DEFAULT");

                    //scale sprite and set innovable
                    tmpSprite.setStatic(true);
                    tmpSprite.setDisplaySize(collisionItem.width, collisionItem.height)
                }
                else{
                    console.log("unsupported collision item shape!");
                }
            })
        })
          //mannually add the collusion zone for bookcase layer
        bookcaseLayer.forEachTile(function(tile){

            let tileWorldPos = bookcaseLayer.tileToWorldXY(tile.x,tile.y);
            let collisionGroup = tileset2.getTileCollisionGroup(tile.index);
            if(!collisionGroup || collisionGroup.objects.length === 0)
            {
                return;
            }

            collisionGroup.objects.forEach(function(collisionItem){
                if(collisionItem.rectangle)
                {
                    let objectX = tileWorldPos.x + collisionItem.x + collisionItem.width/2;
                    let objectY = tileWorldPos.y + collisionItem.y + collisionItem.height/2;

                    let tmpSprite = matterInstance.add.sprite(objectX, objectY,"__DEFAULT");

                    //scale sprite and set innovable
                    tmpSprite.setStatic(true);
                    tmpSprite.setDisplaySize(collisionItem.width, collisionItem.height)
                }
                else{
                    console.log("unsupported collision item shape!");
                }
            })
        })

            //mannually add the collusion zone for barrel layer
        barrelLayer.forEachTile(function(tile){

            let tileWorldPos = barrelLayer.tileToWorldXY(tile.x,tile.y);
            let collisionGroup = tileset1.getTileCollisionGroup(tile.index);
            if(!collisionGroup || collisionGroup.objects.length === 0)
            {
                return;
            }

            collisionGroup.objects.forEach(function(collisionItem){
                if(collisionItem.rectangle)
                {
                    let objectX = tileWorldPos.x + collisionItem.x + collisionItem.width/2;
                    let objectY = tileWorldPos.y + collisionItem.y + collisionItem.height/2;

                    let tmpSprite = matterInstance.add.sprite(objectX, objectY,"__DEFAULT");

                    //scale sprite and set innovable
                    tmpSprite.setStatic(true);
                    tmpSprite.setDisplaySize(collisionItem.width, collisionItem.height)
                }
                else{
                    console.log("unsupported collision item shape!");
                }
            })
        })
        // add enemies here so the show up behind overlap layer
        // find our spawn points
        let spawnPoints = new Array();
        //mannually add the collusion zone for floors layer - looking for spawn points
         floorLayer.forEachTile(function(tile){

            let tileWorldPos = barrelLayer.tileToWorldXY(tile.x,tile.y);
            let collisionGroup = tileset4.getTileCollisionGroup(tile.index);
            if(!collisionGroup || collisionGroup.objects.length === 0)
            {
                return;
            }

            collisionGroup.objects.forEach(function(collisionItem){
                if(collisionItem.rectangle)
                {
                    let objectX = tileWorldPos.x + collisionItem.x + collisionItem.width/2;
                    let objectY = tileWorldPos.y + collisionItem.y + collisionItem.height/2;
                   
                    //if this is a spawn point collision item
                    // add to array of spawn points
                    if(collisionItem.properties && collisionItem.properties.length > 0)
                    {
                        if(collisionItem.properties[0].name === "SpawnPoint")
                        {
                            let currentPoint =new Phaser.Geom.Point(objectX,objectY);
                            spawnPoints.push(currentPoint);
                        }
                    }
                }
                else{
                    console.log("unsupported collision item shape!");
                }
            })
        })

        // Minions - 5 per level for now
        this.enemies = new Array();
        let spawnPointUsed = new Array();
        for(let i = 0; i<5; i++)
        {
            let spawnPointIndex = -1;
            //need to make sure same spawn pont not used twice per level
            do{
                spawnPointIndex = Phaser.Math.RND.between(0,spawnPoints.length - 1)
            }while(spawnPointUsed.includes(spawnPointIndex));

            spawnPointUsed.push(spawnPointIndex);

            // Now let's create a Minion at that Spawn Point 
            let newMinion = this.matter.add.sprite(
                spawnPoints[spawnPointIndex].x,
                spawnPoints[spawnPointIndex].y,
                'character_sprites', 'minion-front-0.png'
            );
            //set some minion properties
            newMinion.maxHitCount = 1;
            newMinion.hitCount = 0;
            newMinion.enemyType = "minion";
            newMinion.speed = BaseScene.MINION_SPEED;
            newMinion.scoreValue = BaseScene.MINION_SCORE;

            newMinion.setScale(2);
            newMinion.setBounce(0.2);
            newMinion.setFixedRotation();
            newMinion.setName("enemy-minion" + ( i+ 1));

            

            // TEMPO -log spawn point choosen 
            console.log(newMinion.name + " created at spawn point: "+ spawnPointIndex)

            //add new enemy to arrray of enemies
            this.enemies.push(newMinion);
        }
        // BLACKKNIGHTS - 5 per level for now
        for(let i = 0; i<2; i++)
        {
            let spawnPointIndex = -1;
            //need to make sure same spawn pont not used twice per level
            do{
                spawnPointIndex = Phaser.Math.RND.between(0,spawnPoints.length - 1)
            }while(spawnPointUsed.includes(spawnPointIndex));

            spawnPointUsed.push(spawnPointIndex);

            // Now let's create a Blackknight at that Spawn Point 
            let newBlackKnight = this.matter.add.sprite(
                spawnPoints[spawnPointIndex].x,
                spawnPoints[spawnPointIndex].y,
                'character_sprites', 'blackknight-front-0.png'
            );
            //set some minion properties
            newBlackKnight.maxHitCount = 2;
            newBlackKnight.hitCount = 0;
            newBlackKnight.enemyType = "blackknight";
            newBlackKnight.speed = BaseScene.BLACKKNIGHT_SPEED;
            newBlackKnight.scoreValue = BaseScene.BLACKKNIGHT_SCORE;

            newBlackKnight.setScale(2);
            newBlackKnight.setBounce(0.2);
            newBlackKnight.setFixedRotation();
            newBlackKnight.setName("enemy-blackknight" + ( i+ 1));

            

            // TEMPO -log spawn point choosen 
            console.log(newBlackKnight.name + " created at spawn point: "+ spawnPointIndex)

            //add new enemy to arrray of enemies
            this.enemies.push(newBlackKnight);
        }
        // EVILPRINCE - 1 per level for now
        for(let i = 0; i<1; i++)
        {
            let spawnPointIndex = -1;
            //need to make sure same spawn pont not used twice per level
            do{
                spawnPointIndex = Phaser.Math.RND.between(0,spawnPoints.length - 1)
            }while(spawnPointUsed.includes(spawnPointIndex));

            spawnPointUsed.push(spawnPointIndex);

            // Now let's create a new evil pring at that Spawn Point 
            let newEvilPrince = this.matter.add.sprite(
                spawnPoints[spawnPointIndex].x,
                spawnPoints[spawnPointIndex].y,
                'character_sprites', 'evilprince-front-0.png'
            );
            //set some minion properties
            newEvilPrince.maxHitCount = 3;
            newEvilPrince.hitCount = 0;
            newEvilPrince.enemyType = "evilprince";
            newEvilPrince.speed = BaseScene.EVILPRINCE_SPEED;
            newEvilPrince.scoreValue = BaseScene.EVILPRINCE_SCORE;

            newEvilPrince.setScale(2);
            newEvilPrince.setBounce(0.2);
            newEvilPrince.setFixedRotation();
            newEvilPrince.setName("enemy-evilprince" + ( i+ 1));

            

            // TEMPO -log spawn point choosen 
            console.log(newEvilPrince.name + " created at spawn point: "+ spawnPointIndex)

            //add new enemy to arrray of enemies
            this.enemies.push(newEvilPrince);
        }

        // add projectiles 
        this.projectiles = new Array();

        // add the overlap foundation to the scene after the king and enemies
        // so they show behind this layer
        const overlapFoundationLayer= map.createLayer("OverlapFoundations",[tileset6],0,0);

         //mannually add the collusion zone for overlap foundation layer
        overlapFoundationLayer.forEachTile(function(tile){

            let tileWorldPos = overlapFoundationLayer.tileToWorldXY(tile.x,tile.y);
            let collisionGroup = tileset6.getTileCollisionGroup(tile.index);
            if(!collisionGroup || collisionGroup.objects.length === 0)
            {
                return;
            }

            collisionGroup.objects.forEach(function(collisionItem){
                if(collisionItem.rectangle)
                {
                    let objectX = tileWorldPos.x + collisionItem.x + collisionItem.width/2;
                    let objectY = tileWorldPos.y + collisionItem.y + collisionItem.height/2;

                    let tmpSprite = matterInstance.add.sprite(objectX, objectY,"__DEFAULT");

                    //scale sprite and set innovable
                    tmpSprite.setStatic(true);
                    tmpSprite.setDisplaySize(collisionItem.width, collisionItem.height)
                }
                else{
                    console.log("unsupported collision item shape!");
                }
            })
        })

        //refactor this into an animation method that takes in the character
        //prefix as a parameter
        
        // create king animations
        this.createCharacterAnimations("king")

        //create minion animations
        this.createCharacterAnimations("minion")

        //create Black knight animations
        this.createCharacterAnimations("blackknight")

        //create evil prince animations
        this.createCharacterAnimations("evilprince")

        // create animations for projectiles
        this.createFireballAnimations();

        // create explosion animations
        this.anims.create({
            key:"explosion",
            frames:this.anims.generateFrameNames('projectile_sprites',{
                prefix: "explosion-",
                suffix:".png",
                start:0,
                end: 5
            }),
            frameRate:10,
            repeat: 0,
            hideOnComplete: true
        })
        //handele matter collision typers
        this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
             //see if this collision between king and enemy
            if (bodyA.gameObject.name === "king" && bodyB.gameObject.name.startsWith("enemy") ||
                bodyA.gameObject.name.startsWith("enemy") && bodyB.gameObject.name === "king") 
            {
                //console.log(" The king was captured");
                this.kingCaptured();
            }
            else if (bodyA.gameObject.name === "projectile" && bodyB.gameObject.name.startsWith("enemy") ||
                bodyA.gameObject.name.startsWith("enemy") && bodyB.gameObject.name === "projectile") 
            {
                console.log(" The enemy was hit!");
                if(bodyA.name === "projectile") //1st object is projectile
                {
                    this.enemyShot(bodyB.gameObject, bodyA.gameObject);                
                }
                else
                {
                    this.enemyShot(bodyA.gameObject, bodyB.gameObject);
                }
            }
            //projectile hitting non-enemy
            else if (bodyA.gameObject.name === "projectile" && bodyB.gameObject.name !== "king" ||
                bodyA.gameObject.name !== "king" && bodyB.gameObject.name === "projectile") 
            {
                if(bodyA.name === "projectile") //1st object is projectile
                {
                    this.shotMissed(bodyA.gameObject);                
                }
                else
                {
                    this.shotMissed(bodyB.gameObject);
                }
            }
            //see if this collision between king and escape point 
            else if (bodyA.gameObject.name === "king" && bodyB.gameObject.name === "escapePoint" ||
                bodyA.gameObject.name === "escapePoint" && bodyB.gameObject.name === "king") 
            {
                // console.log(" The king is escaped through the escape point!");
                this.kingEscapes();
            }
        });

        //handle matter pause event

        this.matter.world.on("pause", ()=>{
            console.log("Game Paused")
            BaseScene.gamePaused= true;
        })

        //need to check high score save in browser localStorage
        this.highScore = 0;
        if(localStorage.highKingScore !== undefined)
        {
            this.highScore = localStorage.highKingScore;
        }

        //going to initialize and show our score and level info
        let fontObject = {
            font: "20px Arial",
            fill: "#FFFFFF",
            align: "center"
        };
        this.levelText = this.add.text(25,10,"LEVEL: " + this.sceneName, fontObject);
        this.levelText.setScrollFactor(0);
        this.scoreText = this.add.text(25, 35, "SCORE: " +
            this.zeroPad(BaseScene.CURRENT_SCORE, 3), fontObject)
        this.scoreText.setScrollFactor(0);
        this.highScoreText = this.add.text(25, 60, "HIGH SCORE: " +
            this.zeroPad(this.highScore, 3), fontObject)
        this.highScoreText.setScrollFactor(0);
    }

    update(){

           if(!BaseScene.gamePaused){

            // deal with our fireballs
            if(Phaser.Input.Keyboard.JustDown(this.spacebar))
            {
                this.shootFireball();
            }

            for(let i=0; i<this.projectiles.length; i++)
            {
                let fireball = this.projectiles[i]
                if(fireball) //so not null
                {
                    fireball.update();
                }
            }

               // lets add in diagonal movement
            if(this.cursors.up.isDown && this.cursors.right.isDown) //north-east
            {
                this.king.setVelocityY(-0.5 * (BaseScene.KING_SPEED));
                this.king.setVelocityX(BaseScene.KING_SPEED);
                this.king.play('king-walk-right', true);
                this.nextKingIdle = 'king-idle-right';
                this.king.direction = "northeast"
            }//
            else if(this.cursors.down.isDown && this.cursors.right.isDown) //south-east
            {
                this.king.setVelocityY(0.5 * BaseScene.KING_SPEED);
                this.king.setVelocityX(BaseScene.KING_SPEED);
                this.king.play('king-walk-right', true);
                this.nextKingIdle = 'king-idle-right';
                this.king.direction = "southeast"
            }
            else if(this.cursors.up.isDown && this.cursors.left.isDown) //north west
            {
                this.king.setVelocityY(-0.5 * BaseScene.KING_SPEED);
                this.king.setVelocityX(-(BaseScene.KING_SPEED));
                this.king.play('king-walk-left', true);
                this.nextKingIdle = 'king-idle-right';
                this.king.direction = "northwest"
            }
            else if(this.cursors.down.isDown && this.cursors.left.isDown) //south west
            {
                this.king.setVelocityY(0.5 * BaseScene.KING_SPEED);
                this.king.setVelocityX(-(BaseScene.KING_SPEED));
                this.king.play('king-walk-left', true);
                this.nextKingIdle = 'king-idle-left';
                this.king.direction = "southwest"
            }

            else if(this.cursors.up.isDown) //north
            {
                this.king.setVelocityY(-(BaseScene.KING_SPEED));
                this.king.setVelocityX(0);
                this.king.play('king-walk-up', true);
                this.nextKingIdle = 'king-idle-back';
                this.king.direction = "north"

            }
            else if(this.cursors.down.isDown) //south
            {
                this.king.setVelocityY(BaseScene.KING_SPEED);
                this.king.setVelocityX(0);
                this.king.play('king-walk-down', true);
                this.nextKingIdle = 'king-idle-front';
                this.king.direction = "south"
            }
            else if(this.cursors.right.isDown) //east
            {
                this.king.setVelocityY(0);
                this.king.setVelocityX(BaseScene.KING_SPEED);
                this.king.play('king-walk-right', true);
                this.nextKingIdle = 'king-idle-right';
                this.king.direction = "east"
            }
            else if(this.cursors.left.isDown) //west
            {
                this.king.setVelocityY(0);
                this.king.setVelocityX(-(BaseScene.KING_SPEED));
                this.king.play('king-walk-left', true);
                this.nextKingIdle = 'king-idle-left';
                this.king.direction = "west"
            }
            else //the king is standing still, so show next idele animation
            {
                this.king.setVelocityY(0);
                this.king.setVelocityX(0);
                this.king.play(this.nextKingIdle, true);

            }
            //start enemies moving
            let currentScene = this;
            let king = this.king;

            //check if enemies in camera and start them moving 
            this.enemies.forEach(function(enemy){
                if(enemy)// do nothing if null
                {
                    if(currentScene.cameras.main.worldView.contains(enemy.x, enemy.y))
                    {
                        //need to determine the orientation between the king and the minion
                        let kingOrientation = currentScene.getkingEnemyOrientation(king, enemy);

                        let enemyAnimation = enemy.enemyType + "-idle-front";
                        let enemyXVelocity = 0;
                        let enemyYVelocity = 0;

                        // if the enemy is not currently moving 

                        if(Math.abs(enemy.body.velocity.x) < 1 && Math.abs(enemy.body.velocity.y) < 1 ) 
                        {
                            if(kingOrientation.aspect ==="x" && kingOrientation.positive === "false")
                            {
                                enemyXVelocity = -(enemy.speed)
                                enemyAnimation = enemy.enemyType +"-walk-left";
                            }
                            else if(kingOrientation.aspect ==="y" && kingOrientation.positive === "true")
                            {
                                enemyYVelocity = enemy.speed;
                                enemyAnimation = enemy.enemyType + "-walk-down";
                            }
                             else if(kingOrientation.aspect ==="y" && kingOrientation.positive === "false")
                            {
                                enemyYVelocity = -(enemy.speed);
                                enemyAnimation = enemy.enemyType +"-walk-up";
                            }
                             else
                            {
                                enemyXVelocity =enemy.speed;
                                enemyAnimation = enemy.enemyType +"-walk-right";
                            }
                        }
                        //else if enemy is already moving 
                        else
                        {
                            if(enemyXVelocity === 0 && kingOrientation.aspect === "x")
                            {
                                enemyYVelocity = 0;
                                
                                //start moving towards the king on x
                                if(kingOrientation.positive === true)
                                {
                                    enemyXVelocity = enemy.speed;
                                    enemyAnimation = enemy.enemyType +"-walk-right";
                                }
                                else
                                {
                                    enemyXVelocity = -(enemy.speed);
                                    enemyAnimation = enemy.enemyType +"-walk-left";
                                }
                            }
                            else if(enemyYVelocity === 0 && kingOrientation.aspect === "y")
                            {
                                enemyXVelocity = 0;
                                
                                //start moving towards the king on y
                                if(kingOrientation.positive === true)
                                {
                                    enemyYVelocity = enemy.speed;
                                    enemyAnimation = enemy.enemyType +"-walk-down";
                                }
                                else
                                {
                                    enemyYVelocity = -(enemy.speed);
                                    enemyAnimation = enemy.enemyType +"-walk-up";
                                }
                            }
                        }

                        enemy.setVelocityY(enemyYVelocity);
                        enemy.currentVelovityY = enemyYVelocity;
                        enemy.setVelocityX(enemyXVelocity);
                        enemy.currentVelovityX = enemyXVelocity;
                        enemy.play(enemyAnimation, true);
                    }
                }
            })
        }
    }// end of not paused condition

    //HELPER FUNCTIONS

    // from the Getting started Video Series
    zeroPad(number, size)
    {
        let stringNumber = String(number);

        while(stringNumber.length < (size || 2))
        {
            stringNumber = "0" + stringNumber
        }

        return stringNumber;
    }

    //this function will get orientation between king and enemy 
    getkingEnemyOrientation(king, enemy)
    {
        let orientation = {
            aspect: "",
            positve: false
        };

        // we need to find in which direction is greatest 
        //king and enemy position
        let xDifference = king.x - enemy.x;
        let yDifference = king.y - enemy.y;

        // we will default to x if both equal
        if(Math.abs(xDifference) >= Math.abs(yDifference))
        {
            orientation.aspect = "x";
            if(xDifference> 0)
            {
                orientation.positive = true;
            }
        }
        else 
        {
            orientation.aspect = "y";
            if(yDifference> 0)
            {
                orientation.positive = true;
            }
        }

        return orientation;
    }

    // shoot firball function 
    shootFireball()
    {
        //play fireball sound
        this.fireballSound.play();
        console.log("shot firball ...")
        let fireball = new Fireball(this)
    }

    //enemy shot function
    enemyShot(enemy, projectile)
    {
        
         projectile.destroy(true);
        this.matter.world.remove(projectile);

        let fireBallIndex = this.projectiles.indexOf(projectile);
        this.projectiles[fireBallIndex] = null;

        //Hey some enemies now do not die on first hit 
        enemy.hitCount += 1;
        if(enemy.maxHitCount > 1 && enemy.hitCount < enemy.maxHitCount)
        {
            return;
        }

        //play fireball sound
        this.explosionSound.play();

        let explosion = new Explosion(this, enemy.x, enemy.y);

        enemy.destroy(true);
        this.matter.world.remove(enemy);

        let enemyIndex = this.enemies.indexOf(enemy);
        this.enemies[enemyIndex] = null;

        // Later - might like to generate a new enemy
        
        //NEED TO INCREASE THJE SCORE
        BaseScene.CURRENT_SCORE += enemy.scoreValue;

        let scoreFormatted = this.zeroPad(BaseScene.CURRENT_SCORE, 3);
        this.scoreText.text= "SCORE: " + scoreFormatted;
        //NEED TO EXPLOSION
    }

    // shot missed function
    shotMissed(projectile)
    {
        //play fireball sound
        this.explosionSound.play();

         let explosion = new Explosion(this, projectile.x, projectile.y);
         projectile.destroy(true);
        this.matter.world.remove(projectile);

        let fireBallIndex = this.projectiles.indexOf(projectile);
        this.projectiles[fireBallIndex] = null;
    }
      // this function call when king escape
     kingEscapes(nextLevel)
    {
        // load next scene if asked in , if null end the game

        if(nextLevel === null){
            console.log("Game over")

            //play gameover sound
            this.gameOverSound.play();

            // pause the matter physics engine
            this.matter.world.pause();

             // set the king's tint to red and stop the king animation
            this.king.setTint(0xff0000);
            this.king.play(this.nextKingIdle, true);

            //check to see if we have high score
            if(localStorage.highKingScore === undefined || 
                localStorage.highKingScore < BaseScene.CURRENT_SCORE)
            {
                localStorage.highKingScore = BaseScene.CURRENT_SCORE;
                console.log("New high score achieved!");
            }
        }
        else{
            console.log("king escaped to : "+nextLevel)
           

            this.scene.start(nextLevel);
        }


    }

    kingCaptured()
    {
        console.log("The king was captured");

        // pause the matter physics engine 
        this.matter.world.pause();

        // set the king to a red tint 
        this.king.setTint(0xff0000)
        this.king.play(this.nextKingIdle, true);
        
        //set all minions to green tint and stop their animations
        this.enemies.forEach(function(enemy){
            if(enemy) //if not null
            {
                 enemy.setTint(0x00ff00);
                enemy.play(enemy.enemyType +"-idle-front", true);
            }

        })

        //stop the level music
        this.levelMusic.stop();

        //play fireball sound
        this.gameOverSound.play();
    }

    //ANIMATION METHODS
    createCharacterAnimations(characterPrefix)
    {
        // add the king when it is moving
        this.anims.create({
            key: characterPrefix + '-walk-up',
            frames: this.anims.generateFrameNames('character_sprites',{
                prefix: characterPrefix+'-back-',
                suffix: '.png',
                start: 0,
                end: 2
            }),
            frameRate:10,
            repeate: -1
        });
        this.anims.create({
            key: characterPrefix+'-walk-down',
            frames: this.anims.generateFrameNames('character_sprites',{
                prefix: characterPrefix+'-front-',
                suffix: '.png',
                start: 0,
                end: 2
            }),
            frameRate:10,
            repeate: -1
        });
        this.anims.create({
            key: characterPrefix+'-walk-left',
            frames: this.anims.generateFrameNames('character_sprites',{
                prefix: characterPrefix+'-left-',
                suffix: '.png',
                start: 0,
                end: 2
            }),
            frameRate:10,
            repeate: -1
        });
        this.anims.create({
            key: characterPrefix+'-walk-right',
            frames: this.anims.generateFrameNames('character_sprites',{
                prefix: characterPrefix+'-right-',
                suffix: '.png',
                start: 0,
                end: 2
            }),
            frameRate:10,
            repeate: -1
        });

        // Character standing still animations

        this.anims.create({
            key: characterPrefix+"-idle-front",
            frames: [{
                key: 'character_sprites',
                frame: characterPrefix+"-front-0.png",
            }],
        })
        this.anims.create({
            key: characterPrefix+"-idle-back",
            frames: [{
                key: 'character_sprites',
                frame: characterPrefix+"-back-0.png",
            }],
        })
         this.anims.create({
            key: characterPrefix+"-idle-left",
            frames: [{
                key: 'character_sprites',
                frame: characterPrefix+"-left-0.png",
            }],
        })
         this.anims.create({
            key: characterPrefix+"-idle-right",
            frames: [{
                key: 'character_sprites',
                frame: characterPrefix+"-right-0.png",
            }],
        })
    }

    //function to create fireball animation

    createFireballAnimations()
    {
        this.anims.create({
            key: "fireball-north",
            frames: this.anims.generateFrameNames('projectile_sprites',{
                prefix: 'fireball-north-',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            frameRate:10,
            repeate: -1
        })
        this.anims.create({
            key: "fireball-northeast",
            frames: this.anims.generateFrameNames('projectile_sprites',{
                prefix: 'fireball-northeast-',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            frameRate:10,
            repeate: -1
        })
        this.anims.create({
            key: "fireball-east",
            frames: this.anims.generateFrameNames('projectile_sprites',{
                prefix: 'fireball-east-',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            frameRate:10,
            repeate: -1
        })
        this.anims.create({
            key: "fireball-southeast",
            frames: this.anims.generateFrameNames('projectile_sprites',{
                prefix: 'fireball-southeast-',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            frameRate:10,
            repeate: -1
        })
        this.anims.create({
            key: "fireball-south",
            frames: this.anims.generateFrameNames('projectile_sprites',{
                prefix: 'fireball-south-',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            frameRate:10,
            repeate: -1
        })
        this.anims.create({
            key: "fireball-southwest",
            frames: this.anims.generateFrameNames('projectile_sprites',{
                prefix: 'fireball-southwest-',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            frameRate:10,
            repeate: -1
        })
        this.anims.create({
            key: "fireball-west",
            frames: this.anims.generateFrameNames('projectile_sprites',{
                prefix: 'fireball-west-',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            frameRate:10,
            repeate: -1
        })
        this.anims.create({
            key: "fireball-northwest",
            frames: this.anims.generateFrameNames('projectile_sprites',{
                prefix: 'fireball-northwest-',
                suffix: '.png',
                start: 0,
                end: 7
            }),
            frameRate:10,
            repeate: -1
        })
    }

    // our loading screen function
    //from: https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/
    playLoadingScreen()
    {
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);


        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        // our own palace revolt logo text
        let logoText = this.make.text({
            x: width / 2,
            y: 100,
            text: 'Palace Revolt II',
            style: {
                font: '100px Arial',
                fill: '#ffd700'
            }
        });
        logoText.setShadow(5, 5, 'rgba(255,0,0,0.5)', 0)
        logoText.setOrigin(0.5, 0.5);
        // loading text
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        // asset text
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

      
        this.load.on('progress', function (value) {
            //console.log(value);
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);

        });
                    
        this.load.on('fileprogress', function (file) {
            //console.log(file.src);
            assetText.setText('Loading asset: ' + file.src);
        });
        
        this.load.on('complete', function () {
            console.log('complete');
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();  
            percentText.destroy(); 
            assetText.destroy();
            logoText.destroy();

        });
    }
}