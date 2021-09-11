const { getAssetType } = require('../src/rules');

const element = {
    "Scheme Type": "Debt",
    "Scheme Name": "ABC"
};

describe('test asset type', () => {
    it('dummy test', () => {
        expect(getAssetType(element)).toEqual("F");
    })
});