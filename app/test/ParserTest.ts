import { M2_TO_TSUBO, TSUBO_TO_M2 } from '../scripts/constants';
import { Parser } from '../scripts/Parser';

describe('Parser', function() {
    it('parses values in 円', async function() {
        const parser = new Parser();
        parser.parse('8000円');
        
        expect(parser.value).toBe(8000);
    });

    it('parses values in 万円', async function() {
        const parser = new Parser();
        parser.parse('8000万円');
        
        expect(parser.value).toBe(80000000);
    });

    it('parses values in 億 and 万円', async function() {
        const parser = new Parser();
        parser.parse('1億8000万円');
        
        expect(parser.value).toBe(180000000);
    });

    it('parses area in m2', async function() {
        const parser = new Parser();
        parser.parse('100m2');
        
        expect(parser.m2).toBe(100);
        expect(parser.tsubo).toBe(100 * M2_TO_TSUBO);
    });

    it('parses area in m²', async function() {
        const parser = new Parser();
        parser.parse('100m²');
        
        expect(parser.m2).toBe(100);
        expect(parser.tsubo).toBe(100 * M2_TO_TSUBO);
    });

    it('parses area in 坪', async function() {
        const parser = new Parser();
        parser.parse('100坪');
        
        expect(parser.m2).toBe(100 * TSUBO_TO_M2);
        expect(parser.tsubo).toBe(100);
    });

    it('parses values with comma', async function() {
        const parser = new Parser();
        parser.parse('8,000円');
        
        expect(parser.value).toBe(8000);
    });

    it('parses values with space', async function() {
        const parser = new Parser();
        parser.parse('8 000 円');
        
        expect(parser.value).toBe(8000);
    });

    it('parses area with comma', async function() {
        const parser = new Parser();
        parser.parse('1,000m2');
        
        expect(parser.m2).toBe(1000);
    });

    it('parses values with space', async function() {
        const parser = new Parser();
        parser.parse('1 000 m2');
        
        expect(parser.m2).toBe(1000);
    });

    it('parses area with decimal', async function() {
        const parser = new Parser();
        parser.parse('1000.01m2');
        
        expect(parser.m2).toBe(1000.01);
    });

    it('parses values with decimal and comma', async function() {
        const parser = new Parser();
        parser.parse('1,000.01m2');
        
        expect(parser.m2).toBe(1000.01);
    });

    it('parses values with decimal and space', async function() {
        const parser = new Parser();
        parser.parse('1 000.011 111m2');
        
        expect(parser.m2).toBe(1000.011111);
    });

    it('parses values with leading / trailing strings', async function() {
        const parser = new Parser();
        parser.parse('あああ8000円あああ');
        
        expect(parser.value).toBe(8000);
    });

    it('parses area with leading / trailing strings', async function() {
        const parser = new Parser();
        parser.parse('あああ100m2あああ');
        
        expect(parser.m2).toBe(100);
    });
});

describe('Parser continuous parsing', function() {
    it('parses area then parses values and calculate tanka', async function() {
        const parser = new Parser();
        parser.parse('100m2');
        parser.parse('1000万円');

        expect(parser.value).toBe(10000000);
        expect(parser.m2).toBe(100);
        expect(parser.isFilled()).toBe(true);
        expect(parser.m2tanka).toBe(10000000 / 100);
        expect(parser.tsubotanka).toBe(10000000 / (100 * M2_TO_TSUBO));
    });
});

describe('Parser multiple parsing', function() {
    it('parses area then parses values and calculate tanka', async function() {
        const parser = new Parser();
        parser.parse('100m2 1000万円');

        expect(parser.value).toBe(10000000);
        expect(parser.m2).toBe(100);
        expect(parser.isFilled()).toBe(true);
        expect(parser.m2tanka).toBe(10000000 / 100);
        expect(parser.tsubotanka).toBe(10000000 / (100 * M2_TO_TSUBO));
    });
});