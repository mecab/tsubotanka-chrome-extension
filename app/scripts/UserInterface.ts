import { Parser } from './Parser';
import { View } from './View';
import { to万円 } from './UnitUtil';

type State = 'START' | 'FIXING_TOOLTIP';

export class UserInterface {
    private _state: State = 'START';
    private _view?: View;

    constructor() {
        document.addEventListener('mousemove', this.mouseMoveHandler.bind(this), true);
        document.addEventListener('click', this.clickHandler.bind(this), true);
        document.addEventListener('contextmenu', this.contextMenuHandler.bind(this), true);
    }

    public contextMenuFiredHandler() {
        this._state = 'START';

        if (!this._view) {
            this._view = new View();
            this._view.init();
        }

        const selectedText = window.getSelection()?.toString() || '';

        const parser = new Parser();
        parser.parse(selectedText);

        if (parser.isFilled()) {
            this._view.addTooltip(`<p>${to万円(parser.tsubotanka!)} 万円/坪</p><p>${to万円(parser.m2tanka!)} 万円/m²</p>`);
            this._state = 'FIXING_TOOLTIP';
        }
        else {
            alert('面積（m2 または 坪）と価格（円）の両方を含む文字列を選択してから実行して下さい。');
        }
    }

    private mouseMoveHandler(e: MouseEvent) {
        if (this._state === 'FIXING_TOOLTIP') {
            this.moveTooltip(e.pageX, e.pageY);
        }
    }

    private clickHandler(e: MouseEvent) {
        if (this._state === 'FIXING_TOOLTIP') {
            this._view!.deactivateTooltip();
            this._state = 'START';
        }
    }

    private contextMenuHandler(e: MouseEvent) {
        if (this._state === 'FIXING_TOOLTIP') {
            this._view!.removeActiveTooltip();
            this._state = 'START';
            e.stopPropagation();
            e.preventDefault();
        }
    }

    private moveTooltip(x: number, y: number) {
        this._view!.moveActiveTooltip(x, y);
    }
}