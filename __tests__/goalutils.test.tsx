import * as goalutils from '../src/components/goals/goalutils';

describe('getDuration test suite', () => {
    test('Sell after null test', () => {
        let duration = goalutils.getDuration(null,2021,2035,0,10,2022,7);
        expect(duration).toBe(8);
        expect(duration).toBeGreaterThan(0);
        expect(duration).not.toBe(null);
    })
    test('Sell after not null', () => {
        let duration = goalutils.getDuration(30,2021,2035,0,10,2022,7);
        expect(duration).not.toBe(null);
        expect(duration).toBe(30);
    })
    test('End year after null test', () => {
        let duration = goalutils.getDuration(null,2021,2035,0,0,2022,7);
        expect(duration).toBe(15);
        expect(duration).toBeGreaterThan(0);
        expect(duration).not.toBeNaN();
    })
})