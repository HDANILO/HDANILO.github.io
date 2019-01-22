
import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import IRunnableExample from "../IRunnableExample";

export default class Example2 implements IRunnableExample{
    private app: PIXI.Application;
    private container: PIXI.Container;
    private lastTime: number = 0;
    private accumulatedTime: number = 0;
    private hasQuit: boolean;
    private margin: number = 5;

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

    private getRandomContainer(): PIXI.Container {
        const container = new PIXI.Container();
        let totalWidth = 0;
        
        let sprites: PIXI.Sprite[] = []
        let txts: PIXI.Text[] = []
        for(let i = 0; i < 3; i++) {
            const rand = this.getRandom(0,1);
            if (rand == 0) {
                const txt = this.getRandomText();
                txt.x = totalWidth;
                //txt.y = 100;
                totalWidth += txt.width + this.margin;
                txts.push(txt);
                container.addChild(txt);
            } else {
                const image = this.getRandomImage();
                image.x = totalWidth;
                const scale = this.getRandomFloat(0.2,1);
                image.scale.x = scale;
                image.scale.y = scale;
                image.anchor.x = 0;
                image.anchor.y = 0;
                totalWidth += image.width + this.margin;
                sprites.push(image);
                container.addChild(image);
            }
        }
        for(let sprite of sprites)
        {
            sprite.y = container.height/2 - sprite.height/2;
        }

        for(let txt of txts)
        {
            txt.y = container.height/2 - txt.height/2;
        }
        
        return container;
    }

    private getRandomText(): PIXI.Text {
        const randomText = ["Hi", "I hope you like my code", 
                            "Is it cold in berlin?", "Lorem Ipsum",
                            "No guts, no story", "My life is a message",
                            "Keep going, be all in", "Dream big, pray bigger",
                            "Stay hungry, stay foolish", "Be happy", "You're amazing",
                            "Enjoy today", "Take it easy"]   
        const txt = randomText[this.getRandom(0,randomText.length-1)];
        return new PIXI.Text(txt,this.getFontStyle());
    }

    private getRandomImage(): PIXI.Sprite {
        let spriteId = this.getRandom(1,188);
        let texture = PIXI.loader.resources["assets/emoji-spritesheet.json"].textures[`emoji-spritesheet-${spriteId}.png`];
        while (texture === undefined) {
            spriteId = this.getRandom(1,188);
            texture = PIXI.loader.resources["assets/emoji-spritesheet.json"].textures[`emoji-spritesheet-${spriteId}.png`];
        }
        return new PIXI.Sprite(texture);
    }

    private getRandom(min: number, max: number): number {
        const rand = Math.round(this.getRandomFloat(min,max));
        return rand;
    }

    private getRandomFloat(min: number, max: number): number {
        const rand = Math.random()*(max-min) + min;
        return rand;
    }

    private getFontStyle(): any {
        return {
            fill: "white",
            fontFamily: "\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif",
            fontSize: this.getRandom(12,48),
            lineJoin: "bevel",
            strokeThickness: 2
        };
    }

    private setupScene() {
        this.spawnObject();
        console.log("setupscene ok");
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    private spawnObject(): void {
        const objContainer = this.getRandomContainer();
        objContainer.x = this.app.renderer.width/2 - objContainer.width/2;
        objContainer.y = 0;
        this.container.addChild(objContainer);
        new TWEEN.Tween(objContainer)
                 .to({y: this.app.renderer.height - objContainer.height}, 15000)
                 .easing(TWEEN.Easing.Cubic.Out)
                 .onComplete(() => {this.destroyContainer(objContainer); })
                 .start();
    }

    private destroyContainer(container: PIXI.Container)
    {
        this.container.removeChild(container);
        container.destroy();
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

        if (this.accumulatedTime >= 2000) {
            this.spawnObject();
            this.accumulatedTime-=2000;
        }
                
        TWEEN.update(time);
    }

    private resize(): void {

    }
}
