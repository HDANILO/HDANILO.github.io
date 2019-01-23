
import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import * as Particle from "pixi-particles";
import IRunnableExample from "../IRunnableExample";

export default class Example3 implements IRunnableExample{
    private app: PIXI.Application;
    private container: PIXI.Container;
    private particleEmitter: Particle.Emitter;
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
        this.app.stage.removeChild(this.container);
        this.container.destroy();
        this.container = undefined;
    }

    private setupScene() {
        this.particleEmitter = this.createParticleEmitter();
        this.container.x = this.app.renderer.width/2 - this.container.width/2;
        this.container.y = this.app.renderer.height - 80;        
        this.particleEmitter.emit = true;
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
        this.particleEmitter.update(deltaTime/1000);

        TWEEN.update(time);
    }

    private createParticleEmitter() : Particle.Emitter {
        return new Particle.Emitter(this.container, 
                                    PIXI.loader.resources["assets/fire.png"].texture, 
                                    {
                                        "alpha": {
                                            "start": 1,
                                            "end": 0
                                        },
                                        "scale": {
                                            "start": 1,
                                            "end": 0.2,
                                            "minimumScaleMultiplier": 1
                                        },
                                        "color": { 
                                            list: [
                                                {
                                                    "value": "#f58b00",
                                                    "time": 0
                                                },
                                                {
                                                    "value": "#ba0000",
                                                    "time": 1
                                                },
                                                {
                                                    "value": "#000000",
                                                    "time": 1.5
                                                }
                                            ],
                                            isStepped: false,
                                        },
                                        "speed": {
                                            "start": 700,
                                            "end": 900,
                                            "minimumSpeedMultiplier": 0.5
                                        },
                                        "acceleration": {
                                            "x": 0,
                                            "y": 0
                                        },
                                        "maxSpeed": 5000,
                                        "startRotation": {
                                            "min": -95,
                                            "max": -85
                                        },
                                        "noRotation": false,
                                        "rotationSpeed": {
                                            "min": 0,
                                            "max": 0
                                        },
                                        "lifetime": {
                                            "min": 0.7,
                                            "max": 1.2
                                        },
                                        "blendMode": "add",
                                        "frequency": 0.005,
                                        "emitterLifetime": -1,
                                        "maxParticles": 200,
                                        "pos": {
                                            "x": 0,
                                            "y": 0
                                        },
                                        "addAtBack": false,
                                        "spawnType": "rect",
                                        "spawnRect": {
                                            "x": 0,
                                            "y": 0,
                                            "w": 20,
                                            "h": 10
                                        }
                                    });
    }
}
