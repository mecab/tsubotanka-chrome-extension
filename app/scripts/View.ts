class Tooltip {
    private _elem: HTMLElement;
    private _content!: string;

    public set content(newContent: string) {
        this.updateContent(newContent);
    }

    public get content(): string {
        return this._content;
    }

    constructor(canvas: HTMLElement, content = '') {
        const elem = document.createElement('div');
        elem.classList.add('tooltip');
        this._elem = elem;

        this.updateContent(content);
        canvas.appendChild(elem);
    }

    private updateContent(newContent: string) {
        this._content = newContent;
        this._elem.innerHTML = newContent;
    }

    public moveTo(x: number, y: number) {
        this._elem.style.left = `${x}px`;
        this._elem.style.top = `${y}px`;
    }

    public remove() {
        this._elem.remove();
    }
}

export class View {
    private _canvas?: HTMLElement;
    private _toolTips: Tooltip[] = [];
    private _activeToolTip?: Tooltip;

    constructor() {

    }

    init () {
        const existingElem = document.getElementById('tsubotanka_canvas');
        if (existingElem) {
            this._canvas = existingElem;
        }
        else {
            const elem = document.createElement('div');
            elem.id = 'tsubotanka_canvas';
            document.body.appendChild(elem);
            this._canvas = elem;
        }
    }

    addTooltip(text: string) {
        if (!this._canvas) {
            throw new Error('Canvas is not initialized');
        }
        const toolTip = new Tooltip(this._canvas, text);
        this._toolTips.push(toolTip);
        this._activeToolTip = toolTip;
    }

    updateActiveTooltip(newContent: string) {
        if (!this._activeToolTip) {
            return;
        }

        this._activeToolTip.content = newContent;
    }

    moveActiveTooltip(x: number, y: number) {
        const activeToolTip = this._activeToolTip;
        if (!activeToolTip) {
            return;
        }

        activeToolTip.moveTo(x, y);
    }

    removeActiveTooltip() {
        if (!this._activeToolTip) {
            return;
        }
        this._activeToolTip.remove();
        this._toolTips = this._toolTips.filter(e => e != this._activeToolTip);
        this._activeToolTip = undefined;
    }

    deactivateTooltip() {
        this._activeToolTip = undefined;
    }
}