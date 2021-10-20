import {__RewireAPI__ as pwGenRewire, validate, generate, DEFAULT_SETTINGS} from './password-generator';

const getRandomLetter = pwGenRewire.__get__('getRandomLetter');
const sub = pwGenRewire.__get__('sub');
const shuffle = pwGenRewire.__get__('shuffle');

const UPPER_CASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER_CASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';

const settings1 = {
    count: 20,
    min: 8,
    max: 10,
    upperCaseLetters: {
        usage: 2,
        except: ''
    },
    lowerCaseLetters: {
        usage: 2,
        except: ''
    },
    numbers: {
        usage: 2,
        except: ''
    },
    symbols: {
        usage: 1,
        available: '-_+'
    },
    allowSpace: false
};

const settings2 = {
    count: 1,
    min: 12,
    max: 32,
    upperCaseLetters: {
        usage: 2,
        except: 'OFR'
    },
    lowerCaseLetters: {
        usage: 1,
        except: 'agd'
    },
    numbers: {
        usage: 1,
        except: '12'
    },
    symbols: {
        usage: 1,
        available: '-_?'
    },
    allowSpace: false
};

test('getRandomLetter', () => {
    for(let i = 0; i < 100; i++) {
        expect(getRandomLetter('ABCDFHIKLMVW')).toEqual(expect.stringMatching(/[ABCDFHIKLMVW]/));
    }
});

test('shuffle', () => {
    const str = 'hogehoge';
    const shuffled = shuffle(str);
    expect(shuffled).not.toEqual(str);
    expect(shuffled.length).toBe(str.length);
});

test('sub', () => {
    expect(sub('ABCDEFG', 'BDG')).toEqual('ACEF');
    expect(sub('ABCDEFG', 'BDGH')).toEqual('ACEF');
    expect(sub('ABCDEFG', 'BdG')).toEqual('ACDEF');
    expect(sub('ABCDEFG', '')).toEqual('ABCDEFG');
    expect(sub('ABCDEFG', '12IJ0')).toEqual('ABCDEFG');
    expect(sub('', 'BdG')).toEqual('');
});

// ToDo: このテストケースは追記してください
test('validate with default settings', () => {
    expect(validate('ABCDEFGH')).toBeFalsy(); //0001
    expect(validate('abcdefgh')).toBeFalsy(); //0010
    expect(validate('abcdEFGH')).toBeFalsy(); //0011
    expect(validate('23456722')).toBeFalsy(); //0100
    expect(validate('234567aa')).toBeFalsy(); //0101
    expect(validate('234567AA')).toBeFalsy(); //0110
    expect(validate('234567aB')).toBeFalsy(); //0111
    expect(validate('--------')).toBeFalsy(); //1000
    expect(validate('-aaaaaaa')).toBeFalsy(); //1001
    expect(validate('-AAAAABB')).toBeFalsy(); //1010
    expect(validate('-aaaaaBB')).toBeFalsy(); //1011
    expect(validate('-2345568')).toBeFalsy(); //1100
    expect(validate('-aaa22bb')).toBeFalsy(); //1101
    expect(validate('-AAA22BB')).toBeFalsy(); //1110
    expect(validate('-AAA22aa')).toBeTruthy(); //1111
    expect(validate('-AAA2a')).toBeFalsy(); //1111
    expect(validate('-AAA22aabb')).toBeTruthy(); //1111
    expect(validate('-AAA22aabb_')).toBeFalsy(); //1111
});

// ToDo: このテストケースは書き換えてください
test('validate with specific settings', () => {
    expect(validate('ABCDEFGH'), settings1).toBeFalsy(); //0001
    expect(validate('abcdefgh'), settings1).toBeFalsy(); //0010
    expect(validate('abcdEFGH'), settings1).toBeFalsy(); //0011
    expect(validate('23456722'), settings1).toBeFalsy(); //0100
    expect(validate('234567aa'), settings1).toBeFalsy(); //0101
    expect(validate('234567AA'), settings1).toBeFalsy(); //0110
    expect(validate('234567aB'), settings1).toBeFalsy(); //0111
    expect(validate('--------'), settings1).toBeFalsy(); //1000
    expect(validate('-aaaaaaa'), settings1).toBeFalsy(); //1001
    expect(validate('-AAAAABB'), settings1).toBeFalsy(); //1010
    expect(validate('-aaaaaBB'), settings1).toBeFalsy(); //1011
    expect(validate('-2345568'), settings1).toBeFalsy(); //1100
    expect(validate('-aaa22bb'), settings1).toBeFalsy(); //1101
    expect(validate('-AAA22BB'), settings1).toBeFalsy(); //1110
    expect(validate('-AAA22aa'), settings1).toBeTruthy(); //1111
    expect(validate('-AAA2a'), settings1).toBeFalsy(); //1111
    expect(validate('-AAA22aabb'), settings1).toBeTruthy(); //1111
    expect(validate('-AAA22aabb_'), settings1).toBeFalsy(); //1111
});

// ToDo: このテストケースは書き換えてください
test('validate with specific settings', () => {
    expect(validate('ABCDEFGH'), settings2).toBeFalsy(); //0001
    expect(validate('abcdefgh'), settings2).toBeFalsy(); //0010
    expect(validate('abcdEFGH'), settings2).toBeFalsy(); //0011
    expect(validate('23456722'), settings2).toBeFalsy(); //0100
    expect(validate('234567aa'), settings2).toBeFalsy(); //0101
    expect(validate('234567AA'), settings2).toBeFalsy(); //0110
    expect(validate('234567aB'), settings2).toBeFalsy(); //0111
    expect(validate('--------'), settings2).toBeFalsy(); //1000
    expect(validate('-aaaaaaa'), settings2).toBeFalsy(); //1001
    expect(validate('-AAAAABB'), settings2).toBeFalsy(); //1010
    expect(validate('-aaaaaBB'), settings2).toBeFalsy(); //1011
    expect(validate('-2345568'), settings2).toBeFalsy(); //1100
    expect(validate('-aaa22bb'), settings2).toBeFalsy(); //1101
    expect(validate('-AAA22BB'), settings2).toBeFalsy(); //1110
    expect(validate('-AAA22aa'), settings2).toBeTruthy(); //1111
    expect(validate('-AAA2a'), settings2).toBeFalsy(); //1111
    expect(validate('-AAA22aabb'), settings2).toBeTruthy(); //1111
    expect(validate('-AAA22aabb_'), settings2).toBeFalsy(); //1111
});

// Validatorが正しく動くことを保証した上で，作成したパスワードすべてがvalidであることを確認する
test('generate with default settings', () => {
    const passwords = generate();
    expect(passwords.length).toBe(DEFAULT_SETTINGS.count);
    for(const password of passwords) {
        expect(validate(password)).toBeTruthy();
    }
});

// Validatorが正しく動くことを保証した上で，作成したパスワードすべてがvalidであることを確認する
test('generate with specific settings', () => {
    const passwords = generate(settings1);
    expect(passwords.length).toBe(settings1.count);
    for (const password of passwords) {
        expect(validate(password, settings1)).toBeTruthy();
    }
});

// ステートフルであることの確認
// 設定を変えて連続で実行しても問題ないことをテストする
// test('continuously generate with each settings', () => {
//     const passwords1 = generate(settings2);
//     expect(passwords1.length).toBe(settings2.count);
//     for (const password of passwords1) {
//         expect(validate(password, settings2)).toBeTruthy();
//     }
//
//     const passwords2 = generate(settings1);
//     expect(passwords2.length).toBe(settings1 .count);
//     for (const password of passwords2) {
//         expect(validate(password, settings1)).toBeTruthy();
//     }
//
//     const passwords3 = generate();
//     expect(passwords3.length).toBe(DEFAULT_SETTINGS.count);
//     for(const password of passwords3) {
//         expect(validate(password)).toBeTruthy();
//     }
// });

// ToDo: 不正なsettingに対してerrorを投げるかの確認
test('check settings', () => {
    except(inputMin.length <= 0).toBeFalsy();
    except(inputMax.length <= 0).toBeFalsy();
});