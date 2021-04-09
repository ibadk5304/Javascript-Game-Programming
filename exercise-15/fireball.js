class Fireball extends Phaser.Physics.Matter.Sprite{
    // constant 
    static FIREBALL_SPEED = 20;

    constructor(scene)
    {
        let x = 0; 
        let y = 0;
        let fireballXVelocity = 0;
        let fireballYVelocity = 0;
        let fireballAnimation = "";

        // fireball shoots in current king directions
        if(scene.king.direction === "north")
        {
            x = scene.king.x;
            y = scene.king.y - 64;
            fireballYVelocity = -(Fireball.FIREBALL_SPEED)
            fireballAnimation = "fireball-north";
        }
        else if(scene.king.direction === "northeast")
        {
            x = scene.king.x + 64;
            y = scene.king.y - 32;
            fireballXVelocity = Fireball.FIREBALL_SPEED;
            fireballYVelocity = -( 0.5 * Fireball.FIREBALL_SPEED)
            fireballAnimation = "fireball-northeast";
        }
        else if(scene.king.direction === "east")
        {
            x = scene.king.x + 64;
            y = scene.king.y;
            fireballXVelocity = Fireball.FIREBALL_SPEED;
            fireballAnimation = "fireball-east";
        }
        else if(scene.king.direction === "southeast")
        {
            x = scene.king.x + 64;
            y = scene.king.y + 32;
            fireballXVelocity = Fireball.FIREBALL_SPEED;
            fireballYVelocity = 0.5 * Fireball.FIREBALL_SPEED;
            fireballAnimation = "fireball-southeast";
        }
        else if(scene.king.direction === "south")
        {
            x = scene.king.x;
            y = scene.king.y + 64;
            fireballYVelocity = Fireball.FIREBALL_SPEED;
            fireballAnimation = "fireball-south";
        }
        else if(scene.king.direction === "southwest")
        {
            x = scene.king.x - 64;
            y = scene.king.y + 32;
            fireballXVelocity = -(Fireball.FIREBALL_SPEED);
            fireballYVelocity = 0.5 * Fireball.FIREBALL_SPEED;
            fireballAnimation = "fireball-southwest";
        }
        else if(scene.king.direction === "west")
        {
            x = scene.king.x - 64;
            y = scene.king.y;
            fireballXVelocity = -(Fireball.FIREBALL_SPEED);
            fireballAnimation = "fireball-west";
        }
        else if(scene.king.direction === "northwest")
        {
            x = scene.king.x - 64;
            y = scene.king.y - 32;
            fireballXVelocity = -(Fireball.FIREBALL_SPEED);
            fireballYVelocity = -( 0.5 * Fireball.FIREBALL_SPEED)
            fireballAnimation = "fireball-northwest";
        }

        super(scene.matter.world, x, y, "fireball");
        scene.add.existing(this);

        this.setBounce(0);
        this.setFixedRotation();
        this.setName("projectile");
        
        this.play(fireballAnimation)
        this.setVelocityX(fireballXVelocity)
        this.setVelocityY(fireballYVelocity)

        scene.projectiles.push(this);
    }

    update(scene)
    {
        // not doing anything special for now
    }
}