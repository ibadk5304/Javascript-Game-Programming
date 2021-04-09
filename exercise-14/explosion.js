class Explosion extends Phaser.Physics.Matter.Sprite{
    // constant 
    static FIREBALL_SPEED = 20;

    constructor(scene, x, y )
    {
        super(scene.matter.world, x, y - 32, "explosion");
        this.currentScene = scene;

        this.setScale(2);
        this.currentScene.add.existing(this);

        this.on("animationComplete", this.cleanUp);

        this.play("explosion")
    }

    cleanUp()
    {
        this.destroy(true);
        this.currentScene.matter.world.remove(this);
    }
}