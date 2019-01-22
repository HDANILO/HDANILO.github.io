export default interface IRunnableExample {
    start: (app: PIXI.Application) => void;
    quit: () => void;
}