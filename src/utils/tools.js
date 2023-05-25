/**
 * @description: 密码判断复杂程度
 * @param {String} s 传入的字符串 必填
 * @param {Object} option 配置对象 可选 默认为 {min: 6, max: 12, characters: false } characters: 表示是否开启特殊字符默认不开启 (默认大小写和数字)
 * @return {Boolean} 返回布尔值
 */
function validSecret(s, option) {
    // -----------初始值-----------
    var regNum = {
        min: 6,
        max: 12,
        characters: false
    };
    // -----------判断合法-----------
    if (s == "") {
        throw new TypeError("Character cannot be empty -of jk-short");
    }
    if (Object.prototype.toString.call(s) != "[object String]") {
        throw new TypeError("The input character is not String -of jk-short");
    }
    if (typeof option !== "undefined") {
        if (Object.prototype.toString.call(option) === "[object Object]") {
            if (option.characters) {
                if (typeof option["characters"] != "boolean") {
                    throw new TypeError("characters must be boolean value -of jk-short");
                }
            }
            for (let i in regNum) {
                if (option[i]) {
                    regNum[i] = option[i];
                }
            }
        }
    }

    // -----------核心-----------
    var reg = new RegExp(
        "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{" +
        regNum["min"] +
        "," +
        regNum["max"] +
        "}$"
    );

    if (regNum.characters) {
        reg = new RegExp(
            "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{" +
            regNum["min"] +
            "," +
            regNum["max"] +
            "}$"
        );
    }
    if (reg.test(s)) {
        return true;
    } else {
        return false;
    }
}

/**
 * @description: 返回当前时间
 * @param {*}
 * @return {String} 输出一个字符串类型
 */
function nowTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate() >= 10 ? now.getDate() : ('0' + now.getDate());
    const hour = now.getHours() >= 10 ? now.getHours() : ('0' + now.getHours());
    const miu = now.getMinutes() >= 10 ? now.getMinutes() : ('0' + now.getMinutes());
    const sec = now.getSeconds() >= 10 ? now.getSeconds() : ('0' + now.getSeconds());
    return +year + "年" + (month + 1) + "月" + date + "日 " + hour + ":" + miu + ":" + sec;
}

/**
 * @description: 随机输出字符串
 * @param {number} num 确定你想要的字符串个数 必填
 * @param {Object} o 配置对象默认{num: true, str: true} 可选 num表示开启数字，str表示开启字符串
 * @return {String} 返回随机字符串
 */
function hash(num, o) {
    var d = {
        num: true,
        str: true,
    };
    var s = "";
    var strs = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g',
        'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u',
        'v', 'w', 'x', 'y', 'z', '0', '1',
        '2', '3', '4', '5', '6', '7', '8',
        '9',
    ];
    if (!(typeof num == "number")) {
        throw new TypeError("num must be a number -of jk-short");
    }

    Object.assign(d, o);

    if (!d["num"] && !d["str"]) {
        throw new Error("Will not return a random string -of jk-short");
    }
    if (!d["num"] && d["str"]) {
        strs = strs.slice(0, 26);
    }
    if (d["num"] && !d["str"]) {
        strs = strs.slice(-10);
    }
    for (var i = 0; i < num; i++) {
        s += strs[Math.floor(Math.random() * strs.length)];
    }
    return s;
}
/**
 * 
 * @returns 获取当前时间
 */
const dirTime = () => {
    // 获取当前日期时间
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}`
}

module.exports = dirTime()

module.exports = {
    validSecret,
    nowTime,
    hash,
    dirTime
}