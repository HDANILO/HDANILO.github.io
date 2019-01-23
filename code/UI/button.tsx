export default class Button extends PIXI.Sprite{
    private text: PIXI.Text;
    private onClickCallback: VoidFunction;

    constructor(text: string, onClick: VoidFunction) {
        super(PIXI.loader.resources["assets/button.png"].texture);
        this.onClickCallback = onClick;
        this.interactive = true;
        this.setupEvents();
        this.setupText(text);
    }

    private setupEvents(): void {
        this.on("click", this.onClick.bind(this));
        this.on("tap", this.onClick.bind(this));
        this.on("mouseover", this.onMouseOver.bind(this));
        this.on("mouseout", this.onMouseOut.bind(this));
        this.on("touchstart", this.onMouseOver.bind(this))
        this.on("touchend", this.onMouseOut.bind(this))
    }

    private setupText(text: string): void {
        this.text = new PIXI.Text(text, {
            fill: "white",
            fontFamily: "\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif",
            fontSize: 24,
            lineJoin: "bevel",
            strokeThickness: 2
        });
        this.text.x = this.width/2 - this.text.width/2;
        this.text.y = this.height/2 - this.text.height/2;
        this.addChild(this.text);
    }

    public setPosition(position: PIXI.Point): void {
        this.x = position.x - this.width/2;
        this.y = position.y - this.height/2;
    }

    private onClick(displayableObject : PIXI.DisplayObject): void {
        if (this.onClickCallback !== undefined) {
            this.onClickCallback();
        }
    }

    private onMouseOver(displayableObject : PIXI.DisplayObject): void {
        this.tint = 0xdddddd;
    }

    private onMouseOut(displayableObject : PIXI.DisplayObject): void {
        this.tint = 0xffffff;
    }
}