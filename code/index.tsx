
import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";

class Task1 {
    private app: PIXI.Application;
    private stack: PIXI.Sprite[];
    private fpsMeter: PIXI.Text;
    private accumulatedTime: number = 0;
    private lastTime: number = 0;
    private animationCount: number = 0;
    private moveCardToYPos: number = 0;
    private windowPad: number = 20;
    private cardCount: number = 144;
    private cardMargin: number = 3;
    private animationFrequency: number = 1000;
    private animationDuration: number = 2000;

    private resize(): void {
        this.app.renderer.resize(window.innerWidth - this.windowPad, window.innerHeight - this.windowPad); 
    }

    public start(): void {
        this.app = new PIXI.Application({autoResize: true, backgroundColor: 0x111111});
        this.fpsMeter = this.createFpsMeter(); 
        this.resize();
        this.stack = [];
        window.addEventListener('resize', this.resize.bind(this));
        document.getElementById("app").appendChild(this.app.view);
        this.load();
    }

    private createFpsMeter(): PIXI.Text {
        const meter = new PIXI.Text("60 fps", {
            fill: "white",
            fontFamily: "\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif",
            fontSize: 14,
            lineJoin: "bevel",
            strokeThickness: 2
        });
        meter.x = this.app.renderer.width - meter.width;
        meter.y = 0;

        return meter;
    }

    private load() {
        PIXI.loader.add("assets/card.png").load(this.setupScene.bind(this))
    }

    private setupScene() {
        const cardTexture = PIXI.loader.resources["assets/card.png"].texture;
        let container = new PIXI.Container();
        for(let i = 0; i < this.cardCount; i++)
        {
            let sprite = new PIXI.Sprite(cardTexture);
            sprite.x = i*this.cardMargin;
            sprite.scale = new PIXI.Point(0.6,0.6);
            this.app.stage.addChild(sprite);
            this.stack.push(sprite);
        }
        this.app.stage.addChild(this.fpsMeter);
        this.moveCardToYPos = window.innerHeight - this.windowPad - this.stack[0].height;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private gameLoop(time: number) {
        requestAnimationFrame(this.gameLoop.bind(this));
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.updateFps(deltaTime);
        this.accumulatedTime += deltaTime;
        if (this.accumulatedTime >= this.animationFrequency && this.stack.length > 0) {
            const sprite = this.stack.pop();
            this.moveCards(sprite,this.animationCount*this.cardMargin,this.moveCardToYPos);
            this.animationCount++;
            this.accumulatedTime -= this.animationFrequency;
        }
        
        TWEEN.update(time);
    }

    private updateFps(deltaTime: number) {
        const fps = 1000/deltaTime;
        this.fpsMeter.text = `${fps.toFixed(2)} fps`;
        this.fpsMeter.x = this.app.renderer.width - this.fpsMeter.width;
    }

    private moveCards(sprite: PIXI.Sprite, posX: number, posY: number) {
        this.reorderCard(sprite);
        const tween = new TWEEN.Tween(sprite)
                            .to({x: posX, y: posY}, this.animationDuration)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .start();
    }

    private reorderCard(sprite: PIXI.Sprite) {
        this.app.stage.removeChild(sprite);
        this.app.stage.addChild(sprite);
    }
}

const task = new Task1();
task.start();