// ToDo: できれば余分なものをexportしたくない（testしたいだけ）
const UPPER_CASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER_CASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';

export const DEFAULT_SETTINGS = {
    count: 100,
    min: 8,
    max: 10,
    upperCaseLetters: {
        usage: 2,
        except: 'IO'
    },
    lowerCaseLetters: {
        usage: 2,
        except: 'l'
    },
    numbers: {
        usage: 2,
        except: '10'
    },
    symbols: {
        usage: 2,
        available: '-_:+'
    },
    allowSpace: false
};

const _settings = {
    count: 10,
    min: 8,
    max: 10,
    upperCaseLetters: {
        usage: 2,
        except: 'IO'
    },
    lowerCaseLetters: {
        usage: 2,
        except: 'l'
    },
    numbers: {
        usage: 2,
        except: '10'
    },
    symbols: {
        usage: 2,
        available: '-_'
    },
    allowSpace: false
};

const sub = (str1, str2) => {
    if(str2.length > 0) {
        return str1.replace(new RegExp('[' + str2 + ']', 'g'), '');
    } else {
        return str1;
    }
}

let upperCaseLettersAvailable = sub(UPPER_CASE_LETTERS, DEFAULT_SETTINGS.upperCaseLetters.except);
let lowerCaseLettersAvailable = sub(LOWER_CASE_LETTERS, DEFAULT_SETTINGS.lowerCaseLetters.except);
let numbersAvailable = sub(NUMBERS, DEFAULT_SETTINGS.numbers.except);

const setSettings = (obj) => {
    _settings.count = !!obj.count && (obj.count > 0) ? obj.count : 10;
    _settings.min = !!obj.min && (obj.min > 4) ? obj.min : 4;
    _settings.max = !!obj.max && (obj.max > obj.min) ? obj.max : _settings.min;

    _settings.upperCaseLetters.usage = (!!obj.upperCaseLetters && obj.upperCaseLetters.usage >= 0 && obj.upperCaseLetters.usage <= 2) ? obj.upperCaseLetters.usage : 2;
    _settings.upperCaseLetters.except = (!!obj.upperCaseLetters && !!obj.upperCaseLetters.except) ? obj.upperCaseLetters.except : _settings.upperCaseLetters.except;
    upperCaseLettersAvailable = sub(UPPER_CASE_LETTERS, _settings.upperCaseLetters.except);

    _settings.lowerCaseLetters.usage = (!!obj.lowerCaseLetters && obj.lowerCaseLetters.usage >= 0 && obj.lowerCaseLetters.usage <= 2) ? obj.lowerCaseLetters.usage : 2;
    _settings.lowerCaseLetters.except = (!!obj.lowerCaseLetters && !!obj.lowerCaseLetters.except) ? obj.lowerCaseLetters.except : _settings.lowerCaseLetters.except;
    lowerCaseLettersAvailable = sub(LOWER_CASE_LETTERS, _settings.lowerCaseLetters.except);

    _settings.numbers.usage = (!!obj.numbers && obj.numbers.usage >= 0 && obj.numbers.usage <= 2) ? obj.numbers.usage : 2;
    _settings.numbers.except = (!!obj.numbers && !!obj.numbers.except) ? obj.numbers.except : _settings.numbers.except;
    numbersAvailable = sub(NUMBERS, _settings.numbers.except);

    _settings.symbols.usage = (!!obj.symbols && obj.symbols.usage >= 0 && obj.symbols.usage <= 2) ? obj.symbols.usage : 2;
    _settings.symbols.available = (!!obj.symbols && !!obj.symbols.available) ? obj.symbols.available : _settings.symbols.available;

    _settings.allowSpace = !!obj.allowSpace ? obj.allowSpace: false;
}

export const generate = (settings) => {
    if(settings) {
        setSettings(settings);
    } else {
        setSettings(DEFAULT_SETTINGS);
    }

    const array = [];
    let count = 0;
    while(count < _settings.count) {
        const length = _settings.min + Math.floor(Math.random() * (_settings.max - _settings.min + 1));
        let password = "";

        // 必須
        if (_settings.upperCaseLetters.usage === 2) {
            password += getRandomUpperCaseLetter();
        }
        if (_settings.lowerCaseLetters.usage === 2) {
            password += getRandomLowerCaseLetter();
        }
        if (_settings.numbers.usage === 2) {
            password += getRandomNumber();
        }
        if (_settings.symbols.usage === 2) {
            password += getRandomSymbol();
        }

        // 生成器のランダマイズ
        // 記号の出現頻度を少し下げるために，記号以外の生成器を配列に多めに入れる
        const generators = [];
        if(_settings.upperCaseLetters.usage > 0) {
            generators.push(getRandomUpperCaseLetter);
            generators.push(getRandomUpperCaseLetter);
        }
        if(_settings.lowerCaseLetters.usage > 0) {
            generators.push(getRandomLowerCaseLetter);
            generators.push(getRandomLowerCaseLetter);
        }
        if(_settings.numbers.usage > 0) {
            generators.push(getRandomNumber);
            generators.push(getRandomNumber);
        }
        if(_settings.symbols.usage > 0) {
            generators.push(getRandomSymbol);
        }

        while (password.length < length) {
            password += generators[Math.floor(Math.random() * generators.length)]();
        }
        password = shuffle(password);
        array.push(password);
        count++;
    }
    return array;
}

const getRandomUpperCaseLetter = () => {
    if(upperCaseLettersAvailable.length > 0) {
        return upperCaseLettersAvailable.charAt(Math.floor(Math.random() * upperCaseLettersAvailable.length));
    } else {
        return '';
    }
}

const getRandomLowerCaseLetter = () => {
    if(lowerCaseLettersAvailable.length > 0) {
        return lowerCaseLettersAvailable.charAt(Math.floor(Math.random() * lowerCaseLettersAvailable.length));
    } else {
        return '';
    }
}

const getRandomNumber = () => {
    if(numbersAvailable.length > 0) {
        return numbersAvailable.charAt(Math.floor(Math.random() * numbersAvailable.length));
    } else {
        return '';
    }
}

const getRandomSymbol = () => {
    if(_settings.symbols.available.length > 0) {
        return _settings.symbols.available.charAt(Math.floor(Math.random() * _settings.symbols.available.length));
    } else {
        return '';
    }
}

const shuffle = (str) => {
    return str.split('').sort(() => 0.5 - Math.random()).join('');
}

export const validate = (str, settings) => {
    if(settings) {
        setSettings(settings);
    } else {
        setSettings(DEFAULT_SETTINGS);
    }

    // 長さチェック
    if(str.length < _settings.min) {
        return false;
    }
    if(_settings.max > 0 && str.length > _settings.max) {
        return false;
    }

    // 必須チェック
    if(_settings.upperCaseLetters.usage === 2 && !new RegExp('[' + upperCaseLettersAvailable + ']').test(str)) {
        return false;
    }
    if(_settings.lowerCaseLetters.usage === 2 && !new RegExp('[' + lowerCaseLettersAvailable + ']').test(str)) {
        return false;
    }
    if(_settings.numbers.usage === 2 && !new RegExp('[' + numbersAvailable + ']').test(str)) {
        return false;
    }
    if(_settings.symbols.usage === 2) {
        const regExp = new RegExp('[' + _settings.symbols.available + ']');
        if(!regExp.test(str)) {
            return false;
        }
    }

    // 使用不可チェック
    if(_settings.upperCaseLetters.usage === 0 && /[A-Z]/.test(str)) {
        return false;
    }
    if(_settings.lowerCaseLetters.usage === 0 && /[a-z]/.test(str)) {
        return false;
    }
    if(_settings.numbers.usage === 0 && /[0-9]/.test(str)) {
        return false;
    }
    if(_settings.symbols.usage === 0 && /[^A-Za-z0-9 ]/.test(str)) {
        return false;
    }
    if(!_settings.allowSpace && / /.test(str)) {
        return false;
    }

    // 使用不可文字チェック
    if(new RegExp('[' + _settings.upperCaseLetters.except + ']').test(str)) {
        return false;
    }
    if(new RegExp('[' + _settings.lowerCaseLetters.except + ']').test(str)) {
        return false;
    }
    if(new RegExp('[' + _settings.numbers.except + ']').test(str)) {
        return false;
    }
    if(new RegExp('[^' + _settings.symbols.available + 'A-Za-z0-9 ]').test(str)) {
        return false;
    }

    // どんな場合でもbegin or end にspaceは不可
    return !/^ .+$/.test(str) && !/^.+ $/.test(str);
}