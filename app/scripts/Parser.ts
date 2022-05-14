import { M2_TO_TSUBO, TSUBO_TO_M2 } from "./constants";

const VALUE_REGEXP = /(([0-9]+[,\s]?)*[0-9]\s*億)?([0-9]+[,\s]?)*[0-9]\s*万?円+/g;
const AREA_REGEXP = /([0-9]+[,\s]?)*[0-9]\s*(.[0-9\s]+)?\s*(坪|平米|m2|m²)+/g;

export class Parser {
    private _m2?: number = undefined;
    private _value?: number = undefined;

    public get tsubo(): number | undefined {
        if (this.m2 == null) {
            return undefined;
        }

        return this._m2! * M2_TO_TSUBO;
    }

    public get tsubotanka(): number | undefined {
        if (!this.isFilled()) {
            return undefined;
        }

        return this.value! / this.tsubo!;
    }

    public get m2tanka(): number | undefined {
        if (!this.isFilled()) {
            return undefined;
        }
        
        return this.value! / this.m2!;
    }

    public get m2(): number | undefined {
        return this._m2;
    }

    public get value(): number | undefined {
        return this._value
    }

    constructor() {
    }

    public parse(text: string) {
        console.log('parsing:', text);

        // "1000m2 1000万円" みたいな値が来たときに、"2 1000万円"として処理されないように
        // "1000m2! 1000万円" としちゃう
        const preProcessedText =  text.split('m2').join('m2!');

        const value = this.parseValue(preProcessedText);
        if (value != null) {
            this._value = value;
        }

        const m2 = this.parseArea(preProcessedText);
        if (m2 != null) {
            this._m2 = m2;
        }

        console.log(`parsed: value: ${this.value}, area: ${this.m2} (${this.tsubo})`);
    }

    private parseValue(text: string): number | undefined {
        const [ match ] = text.match(VALUE_REGEXP) ?? [];
        if (!match) {
            return undefined;
        }

        const okuString = match.includes('億') ? match.split('億')[0]! : '0';
        const okuNumber = parseInt(okuString.match(/[0-9]/g)!.join(''), 10);

        const underOkuText = match.includes('億') ? match.split('億')[1]! : match;
        const underOkuNumber = parseInt(underOkuText.match(/[0-9]/g)!.join(''), 10);
        const base = underOkuText.includes('万') ? 10000 : 1;
        
        return okuNumber * 100000000 + underOkuNumber * base;
    }

    private parseArea(text: string): number | undefined {
        const [ match ] = text.match(AREA_REGEXP) ?? [];
        if (!match) {
            return undefined;
        }

        const areaNumber = parseFloat(
            match
                .replace('m²', '')
                .replace('m2', '')
                .replace('平米', '')
                .replace('坪', '')
                .match(/[0-9.]/g)!
                .join('')
        );
        const base = match.includes('坪') ? TSUBO_TO_M2 : 1;
        
        return areaNumber * base;
    }

    public isFilled(): boolean {
        return this._m2 != null && this._value != null;
    }
}