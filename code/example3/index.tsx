
import * as PIXI from "pixi.js";
import * as Particle from "pixi-particles";
import IRunnableExample from "../IRunnableExample";

export default class Example3 implements IRunnableExample{
    private app: PIXI.Application;
    private container: PIXI.Container;
    private fireParticleEmitter: Particle.Emitter;
    private smokeParticleEmitter: Particle.Emitter;
    private lastTime: number = 0;
    private hasQuit: boolean;

    public start(app: PIXI.Application): void {
        this.app = app;
        this.container = new PIXI.Container();
        this.hasQuit = false;
        this.app.stage.addChild(this.container);
        this.setupScene();
    }

    public quit(): void {
        if (this.hasQuit) {
            return;
        }
        this.hasQuit = true;
        if (this.app.renderer.type === PIXI.RENDERER_TYPE.WEBGL) {
            this.app.renderer.plugins.sprite.sprites.length = 0;
        }
        this.app.stage.removeChild(this.container);
        this.container.destroy();
        this.container = undefined;
    }

    private setupScene() {
        this.smokeParticleEmitter = this.createSmokeParticleEmitter();
        this.fireParticleEmitter = this.createFireParticleEmitter();
        this.updatePosition();
        this.smokeParticleEmitter.emit = true;
        this.fireParticleEmitter.emit = true;
        requestAnimationFrame(this.gameLoop.bind(this));
    }


    private updatePosition() {
        const position : PIXI.Point = this.app.renderer.plugins.interaction.mouse.global;
        
        this.smokeParticleEmitter.spawnPos.x = position.x;
        this.smokeParticleEmitter.spawnPos.y = position.y;
        this.fireParticleEmitter.spawnPos.x = position.x;
        this.fireParticleEmitter.spawnPos.y = position.y;      
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
        this.smokeParticleEmitter.update(deltaTime/1000);
        this.fireParticleEmitter.update(deltaTime/1000);
        
        this.updatePosition();
    }

    private createSmokeParticleEmitter() : Particle.Emitter {
        return new Particle.Emitter(this.container, 
                                    PIXI.loader.resources["assets/smoke.png"].texture, 
                                    PIXI.loader.resources["assets/smokeParticle.json"].data);
    }


    private createFireParticleEmitter() : Particle.Emitter {
        return new Particle.Emitter(this.container, 
                                    PIXI.loader.resources["assets/fire.png"].texture, 
                                    PIXI.loader.resources["assets/fireParticle.json"].data);
    }
}
