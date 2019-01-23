export default class Button {
    private sprite: PIXI.Sprite;
    private text: PIXI.Text;
    private onClickCallback: VoidFunction;

    constructor(text: string, onClick: VoidFunction) {
        this.onClickCallback = onClick;
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["assets/button.png"].texture);
        this.sprite.interactive = true;
        this.sprite.on("click", this.onClick.bind(this));
        this.sprite.on("tap", this.onClick.bind(this));
        this.sprite.on("mouseover", this.onMouseOver.bind(this));
        this.sprite.on("mouseout", this.onMouseOut.bind(this));
        this.sprite.on("touchstart", this.onMouseOver.bind(this))
        this.sprite.on("touchend", this.onMouseOut.bind(this))
        this.text = new PIXI.Text(text, {
            fill: "white",
            fontFamily: "\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif",
            fontSize: 24,
            lineJoin: "bevel",
            strokeThickness: 2
        });
        this.text.x = this.sprite.width/2 - this.text.width/2;
        this.text.y = this.sprite.height/2 - this.text.height/2;
        this.sprite.addChild(this.text);
    }

    public setPosition(position: PIXI.Point): void {
        this.sprite.x = position.x - this.sprite.width/2;
        this.sprite.y = position.y - this.sprite.height/2;
    }

    private onClick(displayableObject : PIXI.DisplayObject): void {
        if (this.onClickCallback !== undefined) {
            this.onClickCallback();
        }
    }

    private onMouseOver(displayableObject : PIXI.DisplayObject): void {
        this.sprite.tint = 0xdddddd;
    }

    private onMouseOut(displayableObject : PIXI.DisplayObject): void {
        this.sprite.tint = 0xffffff;
    }

    public getDisplayableObject(): PIXI.DisplayObject {
        return this.sprite;
    }

    public getWidth(): number {
        return this.sprite.width;
    }

    public getHeight(): number {
        return this.sprite.height;
    }
}