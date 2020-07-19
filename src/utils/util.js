import crypto from "crypto";

function getNowTimeStamp() {
    let now = new Date().getTime();
    return parseFloat(now / 1000).toFixed(0);
}

function genAPISign(data) {
    data.ts = getNowTimeStamp();
    let keys = Object.keys(data).sort();
    let raw_sign = "";
    for (let k of keys) {
        raw_sign += (k + data[k]);
    }
    let hashmd5 = crypto.createHash('md5');
    data.sign = hashmd5.update(raw_sign).digest('hex').toUpperCase();
    console.log("genAPISign", raw_sign, data);
    return data;
}

function isUrl(url) {
    return /^https?:\/\/.+/.test(url)
}

export { genAPISign, isUrl };
