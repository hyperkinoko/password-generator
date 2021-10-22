const UPPER_CASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER_CASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';

export const DEFAULT_SETTINGS = {
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

const getSettings = (obj) => {
    const _settings = {
        ...DEFAULT_SETTINGS,
        upperCaseLetters: {...DEFAULT_SETTINGS.upperCaseLetters},
        lowerCaseLetters: {...DEFAULT_SETTINGS.lowerCaseLetters},
        numbers: {...DEFAULT_SETTINGS.numbers},
        symbols: {...DEFAULT_SETTINGS.symbols}
    };

    _settings.count = !!obj.count && (obj.count > 0) ? obj.count : DEFAULT_SETTINGS.count;
    _settings.min = !!obj.min && (obj.min > 4) ? obj.min : DEFAULT_SETTINGS.min;
    _settings.max = !!obj.max && (obj.max > obj.min) ? obj.max : _settings.min;

    _settings.upperCaseLetters.usage =
        (!!obj.upperCaseLetters && obj.upperCaseLetters.usage >= 0 && obj.upperCaseLetters.usage <= 2)
            ? obj.upperCaseLetters.usage : DEFAULT_SETTINGS.upperCaseLetters.usage;
    _settings.upperCaseLetters.except =
        (!!obj.upperCaseLetters && (!!obj.upperCaseLetters.except || obj.upperCaseLetters.except === ''))
            ? obj.upperCaseLetters.except : DEFAULT_SETTINGS.upperCaseLetters.except;
    _settings.upperCaseLetters.available = sub(UPPER_CASE_LETTERS, _settings.upperCaseLetters.except);

    _settings.lowerCaseLetters.usage =
        (!!obj.lowerCaseLetters && obj.lowerCaseLetters.usage >= 0 && obj.lowerCaseLetters.usage <= 2)
            ? obj.lowerCaseLetters.usage : DEFAULT_SETTINGS.lowerCaseLetters.usage;
    _settings.lowerCaseLetters.except =
        (!!obj.lowerCaseLetters && (!!obj.lowerCaseLetters.except || obj.lowerCaseLetters.except === ''))
            ? obj.lowerCaseLetters.except : DEFAULT_SETTINGS.lowerCaseLetters.except;
    _settings.lowerCaseLetters.available =  sub(LOWER_CASE_LETTERS, _settings.lowerCaseLetters.except);

    _settings.numbers.usage =
        (!!obj.numbers && obj.numbers.usage >= 0 && obj.numbers.usage <= 2)
            ? obj.numbers.usage : DEFAULT_SETTINGS.numbers.usage;
    _settings.numbers.except =
        (!!obj.numbers && (!!obj.numbers.except || obj.numbers.except === ''))
            ? obj.numbers.except : DEFAULT_SETTINGS.numbers.except;
    _settings.numbers.available =  sub(NUMBERS, _settings.numbers.except);

    _settings.symbols.usage =
        (!!obj.symbols && obj.symbols.usage >= 0 && obj.symbols.usage <= 2)
            ? obj.symbols.usage : DEFAULT_SETTINGS.symbols.usage;
    _settings.symbols.available = (!!obj.symbols && !!obj.symbols.available)
        ? obj.symbols.available : DEFAULT_SETTINGS.symbols.available;

    _settings.allowSpace = !!obj.allowSpace ? obj.allowSpace : false;
    return _settings;
}

export const generate = (settings) => {
    const _settings = settings ? getSettings(settings) : getSettings(DEFAULT_SETTINGS);
    console.log(_settings);

    let allAvailableChar = '';
    if(_settings.upperCaseLetters.usage > 0) {
        allAvailableChar += _settings.upperCaseLetters.available;
    }
    if(_settings.lowerCaseLetters.usage > 0) {
        allAvailableChar += _settings.lowerCaseLetters.available;
    }
    if(_settings.numbers.usage > 0) {
        allAvailableChar += _settings.numbers.available;
    }
    if(_settings.symbols.usage > 0) {
        allAvailableChar += _settings.symbols.available;
    }
    if(_settings.allowSpace) {
        allAvailableChar += ' ';
    }

    if(!allAvailableChar.length > 0) {
        return null; // ToDo: Errorを投げるでもよい
    }

    const array = [];
    let count = 0;
    while(count < _settings.count) {
        const length = _settings.min + Math.floor(Math.random() * (_settings.max - _settings.min + 1));
        let password = "";

        // 必須
        if (_settings.upperCaseLetters.usage === 2) {
            password += getRandomLetter(_settings.upperCaseLetters.available);
        }
        if (_settings.lowerCaseLetters.usage === 2) {
            password += getRandomLetter(_settings.lowerCaseLetters.available);
        }
        if (_settings.numbers.usage === 2) {
            password += getRandomLetter(_settings.numbers.available);
        }
        if (_settings.symbols.usage === 2) {
            password += getRandomLetter(_settings.symbols.available);
        }

        while (password.length < length) {
            password += getRandomLetter(allAvailableChar);
        }

        password = shuffle(password);

        if(validate(password)) {
            array.push(password);
            count++;
        }
    }
    console.log(array);
    return array;
}

const getRandomLetter = (str) => {
    if(str.length > 0) {
        return str.charAt(Math.floor(Math.random() * str.length));
    } else {
        return '';
    }
}

const shuffle = (str) => {
    return str.split('').sort(() => 0.5 - Math.random()).join('');
}

export const validate = (str, settings) => {
    const _settings = settings ? getSettings(settings) : getSettings(DEFAULT_SETTINGS);

    // 長さチェック
    if(str.length < _settings.min) {
        return false;
    }
    if(_settings.max > 0 && str.length > _settings.max) {
        return false;
    }

    // 必須チェック
    if(_settings.upperCaseLetters.usage === 2 && !new RegExp('[' + _settings.upperCaseLetters.available + ']').test(str)) {
        return false;
    }
    if(_settings.lowerCaseLetters.usage === 2 && !new RegExp('[' + _settings.lowerCaseLetters.available + ']').test(str)) {
        return false;
    }
    if(_settings.numbers.usage === 2 && !new RegExp('[' + _settings.numbers.available + ']').test(str)) {
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