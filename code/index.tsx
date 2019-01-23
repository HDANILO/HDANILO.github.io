import * as PIXI from "pixi.js";
import Button from "./UI/button"
import Example1 from "./example1/index"
import Example2 from "./example2/index"
import Example3 from "./example3/index"
import IRunnableExample from "./IRunnableExample";


class Main {
    private app: PIXI.Application;
    private menuContainer: PIXI.Container;
    private overlayContainer: PIXI.Container;
    private fpsMeter: PIXI.Text;
    private runningExample: IRunnableExample;
    private buttonExample1: Button;
    private buttonExample2: Button;
    private buttonExample3: Button;
    private backButton: Button;
    private loaded: boolean;
    private windowPad: number = 20;
    private lastTime: number = 0;

    public start(): void {
        this.app = new PIXI.Application({autoResize: true, backgroundColor: 0x111111});
        this.menuContainer = new PIXI.Container();
        this.overlayContainer = new PIXI.Container();
        this.fpsMeter = this.createFpsMeter(); 
        this.overlayContainer.addChild(this.fpsMeter);
        this.app.stage.addChild(this.overlayContainer);
        window.addEventListener('resize', this.resize.bind(this));
        document.getElementById("app").appendChild(this.app.view);
        this.resize();
        this.load();
    }

    private load() {
        PIXI.loader.add("assets/button.png")
                   .add("assets/card.png")
                   .add("assets/emoji-spritesheet.json")
                   .add("assets/fire.png")
                   .add("assets/smoke.png")
                   .add("assets/fireParticle.json")
                   .add("assets/smokeParticle.json")
                   .add("assets/phrases.json")
                   .load(this.setupScene.bind(this))
    }

    private setupScene()
    {
        this.loaded = true;
        this.buttonExample1 = new Button("Example 1", this.startExample1.bind(this));
        this.buttonExample2 = new Button("Example 2", this.startExample2.bind(this));
        this.buttonExample3 = new Button("Example 3", this.startExample3.bind(this));
        this.menuContainer.addChild(this.buttonExample1.getDisplayableObject());
        this.menuContainer.addChild(this.buttonExample2.getDisplayableObject());
        this.menuContainer.addChild(this.buttonExample3.getDisplayableObject());
        this.backButton = new Button("Back", this.quitExample.bind(this));
        this.updateButtonsPosition();
        this.loadMenu();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private updateButtonsPosition()
    {
        this.buttonExample1.setPosition(new PIXI.Point(this.app.renderer.width/2, 
                                                       this.app.renderer.height/4));
        this.buttonExample2.setPosition(new PIXI.Point(this.app.renderer.width/2, 
                                                       this.app.renderer.height*2/4));
        this.buttonExample3.setPosition(new PIXI.Point(this.app.renderer.width/2, 
                                                       this.app.renderer.height*3/4));
        this.backButton.setPosition(new PIXI.Point(this.app.renderer.width - this.backButton.getWidth()/2 - 10, 
                                                   this.app.renderer.height - this.backButton.getHeight()/2 - 10));
    }

    private gameLoop(time: number): void {
        requestAnimationFrame(this.gameLoop.bind(this));
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.updateFps(deltaTime);
    }

    private updateFps(deltaTime: number) {
        const fps = 1000/deltaTime;
        this.fpsMeter.text = `${fps.toFixed(2)} fps`;
        this.fpsMeter.x = this.app.renderer.width - this.fpsMeter.width;
    }

    private startExample1(): void {
        this.unloadMenu();
        this.runningExample = new Example1();
        this.runningExample.start(this.app);
        this.refreshOverlay();
    }

    private startExample2(): void {
        this.unloadMenu();
        this.runningExample = new Example2();
        this.runningExample.start(this.app);
        this.refreshOverlay();
    }

    private startExample3(): void {
        this.unloadMenu();
        this.runningExample = new Example3();
        this.runningExample.start(this.app);
        this.refreshOverlay();
    }

    private unloadMenu(): void {
        this.app.stage.removeChild(this.menuContainer);
        this.overlayContainer.addChild(this.backButton.getDisplayableObject());
    }

    private loadMenu(): void {
        this.app.stage.addChild(this.menuContainer);
        this.overlayContainer.removeChild(this.backButton.getDisplayableObject());
    }

    private refreshOverlay(): void {
        this.app.stage.removeChild(this.overlayContainer);
        this.app.stage.addChild(this.overlayContainer);
    }

    private quitExample(): void {
        this.runningExample.quit();
        this.loadMenu();
    }

    private resize(): void {
        this.app.renderer.resize(window.innerWidth - this.windowPad, window.innerHeight - this.windowPad); 
        if (this.loaded) {
            this.updateButtonsPosition();
        }
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
}

const main = new Main();
main.start();
//main.startExample1();