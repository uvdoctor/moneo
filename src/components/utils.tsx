export function getWinner(arr: Array<number>) {
    return arr.reduce((a, b) => Math.max(a, b));
}

export function changeVal(val: string, defaultVal: string = '', number: boolean =true, float: boolean =false) {
    if(!val) return defaultVal;
    if(val === 'true') return true;
    if(val === 'false') return false;
    if(float) return parseFloat(val);
    if(number) return parseInt(val);
    return val;
}

export function change(e: React.FormEvent<HTMLInputElement>, setter: Function, number: boolean = true, float: boolean = false) {
    let val = changeVal(e.currentTarget.value, '', number, float);
    setter(val);
};