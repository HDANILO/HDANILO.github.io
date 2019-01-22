
import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import IRunnableExample from "../IRunnableExample";

export default class Example1 implements IRunnableExample{
    private app: PIXI.Application;
    private container: PIXI.Container;
    private stack: PIXI.Sprite[] = [];
    private bottomStack: PIXI.Sprite[] = [];
    private accumulatedTime: number = 0;
    private lastTime: number = 0;
    private animationCount: number = 0;
    private cardCount: number = 144;
    private cardMargin: number = 3;
    private hasQuit: boolean;
    private animationFrequency: number = 1000;
    private animationDuration: number = 2000;

    public start(app: PIXI.Application): void {
        this.app = app;
        this.hasQuit = false;
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        this.resize();
        this.setupScene();
        window.addEventListener('resize', this.resize.bind(this));
    }

    public quit(): void {
        if (this.hasQuit) {
            return;
        }
        this.hasQuit = true;
        this.app.stage.removeChild(this.container);
        this.container.destroy();
        this.container = undefined;
    }

    private setupScene() {
        const cardTexture = PIXI.loader.resources["assets/card.png"].texture;
        let container = new PIXI.Container();
        for(let i = 0; i < this.cardCount; i++)
        {
            let sprite = new PIXI.Sprite(cardTexture);
            sprite.x = i*this.cardMargin;
            sprite.scale = new PIXI.Point(0.6,0.6);
            this.container.addChild(sprite);
            this.stack.push(sprite);
        }
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private gameLoop(time: number) {
        if (this.hasQuit) {
            return;
        }
        if (this.lastTime === 0) {
            this.lastTime = time;
        }
        requestAnimationFrame(this.gameLoop.bind(this));
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        
        this.accumulatedTime += deltaTime;
        if (this.accumulatedTime >= this.animationFrequency && this.stack.length > 0) {
            const sprite = this.stack.pop();
            
            this.moveCards(sprite,this.animationCount*this.cardMargin,this.getSpriteY(sprite));
            this.animationCount++;
            this.accumulatedTime -= this.animationFrequency;
        }
        
        TWEEN.update(time);
    }

    private moveCards(sprite: PIXI.Sprite, posX: number, posY: number) {
        this.reorderCard(sprite);
        let coords = {x:0.0, y:0.0};
        const initialPos = {x:sprite.x, y:sprite.y};
        const tween = new TWEEN.Tween(coords)
                            .to({x: 1.0, y: 1.0}, this.animationDuration)
                            .onUpdate(() => { 
                                sprite.x = this.lerp(initialPos.x,posX,coords.x); 
                                sprite.y = this.lerp(initialPos.y,this.getSpriteY(sprite),coords.y); 
                            })
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .onComplete(() => {this.bottomStack.push(sprite);})
                            .start();
    }
    
    private reorderCard(sprite: PIXI.Sprite) {
        this.container.removeChild(sprite);
        this.container.addChild(sprite);
    }

    private resize(): void {
        for(let sprite of this.bottomStack) {
            sprite.y = this.getSpriteY(sprite);
        }
    }

    private getSpriteY(sprite: PIXI.Sprite): number {
        return this.app.renderer.height - sprite.height;
    }

    private lerp(a: number, b: number, f: number) : number {
        return a + f * (b - a);
    }
}
