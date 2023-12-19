import fc, { Arbitrary } from 'fast-check';
import {
  number,
  string,
  null as idtltNull,
  undefined as idtltUndefined,
  literal,
  object,
  array,
  dictionary,
  boolean,
  union,
  tuple,
  intersection,
  unknown,
  isoDate,
  discriminatedUnion,
  Ok,
  Err,
  absoluteUrl,
  booleanFromString,
  numberFromString,
  intFromString,
} from 'idonttrustlikethat';
import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  __guessTupleLength,
  __guessTupleTypes,
  __injectDefaultValue,
  __mapTypeToIdtltType,
  inputOf,
} from '../src/main.ts';
import { idtltNotification, idtltInfo, idtltLocation } from './fixture/alert.ts';

describe('inputOf primitives', () => {
  it('can convert idtlt null to fc null', () => {
    const validator = idtltNull;
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<null>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt undefined to fc fc.constant(undefined)', () => {
    const validator = idtltUndefined;
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt string to fc.string()', () => {
    const validator = string;
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<string>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt string with `default` to fc.string()', () => {
    const validator = string.default(':(');
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<string>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional string to fc.option()', () => {
    const validator = string.optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<string | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional string to fc.option()', () => {
    const validator = string.nullable();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<string | null | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt number to fc.integer()', () => {
    const validator = number;
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<number>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional number to fc.option()', () => {
    const validator = number.optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<number | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf tagged string/number', () => {
  it('can convert idtlt tagged string to fc.string()', () => {
    type UserId = string & { __tag: 'UserId' };
    const validator = string.tagged<UserId>();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<UserId>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional tagged string to fc.option()', () => {
    type UserId = string & { __tag: 'UserId' };
    const validator = string.tagged<UserId>().optional();

    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<UserId | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt tagged number to fc.number()', () => {
    type UserId = number & { __tag: 'UserId' };
    const validator = number.tagged<UserId>();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<UserId>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional tagged number to fc.option()', () => {
    type UserId = number & { __tag: 'UserId' };
    const validator = number.tagged<UserId>().optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<UserId | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf literal', () => {
  it('can convert idtlt literal to fc.string()', () => {
    const validator = literal('foo');
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<'foo'>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional literal to fc.option()', () => {
    const validator = literal('foo').optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<'foo' | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf object', () => {
  it('can convert idtlt object to fc.record()', () => {
    const validator = object({
      id: string,
    });
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<{ id: string }>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional object to fc.option()', () => {
    const validator = object({
      id: string,
    }).optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<{ id: string } | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt complex object to fc.record()', () => {
    const validator = idtltNotification;
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<typeof idtltNotification.T>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf array', () => {
  it('can convert idtlt array to fc.array()', () => {
    const validator = array(number);
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<Array<number>>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt array of object to fc.array()', () => {
    const validator = array(idtltNotification);
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<Array<typeof idtltNotification.T>>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional array to fc.option()', () => {
    const validator = array(number).optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<Array<number> | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf dictionary', () => {
  it('can convert idtlt dictionary to fc.dictionary()', () => {
    const validator = dictionary(string, number);
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<{ [x: string]: number }>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt dictionary of string and object to fc.dictionary()', () => {
    const validator = dictionary(string, idtltNotification);
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<{ [x: string]: typeof idtltNotification.T }>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional dictionary to fc.option()', () => {
    const validator = dictionary(string, number).optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<{ [x: string]: number } | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf tuple', () => {
  // Works only for primitive value
  it('can convert idtlt tuple of primitive to fc.tuple()', () => {
    const validator = tuple(string, number);
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<[string, number]>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional tuple of primitive to fc.option()', () => {
    const validator = tuple(string, number).optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<[string, number] | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf union', () => {
  // Works only for primitive value
  it('can convert idtlt union to fc.oneof()', () => {
    const validator = union(string, number);
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<string | number>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt union to fc.oneof()', () => {
    const validator = union(idtltLocation, idtltInfo);
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<typeof idtltLocation.T | typeof idtltInfo.T>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional union to fc.option()', () => {
    const validator = union(object({ foo: number }), object({ bar: string })).optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<{ foo: number } | { bar: string } | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf intersection', () => {
  it('can convert idtlt intersection of object to fc.record()', () => {
    const validator = intersection(object({ foo: number }), object({ bar: string }));
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<{ foo: number; bar: string }>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt intersection of complexe object to fc.record()', () => {
    const validator = intersection(idtltInfo, idtltNotification);
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<typeof idtltInfo.T & typeof idtltNotification.T>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional intersection to fc.option()', () => {
    const validator = intersection(object({ foo: number }), object({ bar: string })).optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<({ foo: number } & { bar: string }) | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf unknown', () => {
  it('can convert idtlt unknown to fc.constantFrom()', () => {
    const validator = unknown;
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<unknown>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf boolean', () => {
  it('can convert idtlt boolean to fc.boolean()', () => {
    const validator = boolean;
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<boolean>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional boolean to fc.option()', () => {
    const validator = boolean.optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<boolean | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf isoDate', () => {
  it('can convert idtlt isoDate to object to fc.date.isoString()', () => {
    const validator = isoDate;
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<Date>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt optional isoDate to fc.option()', () => {
    const validator = isoDate.optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<Date | undefined>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf absoluteUrl', () => {
  it('can convert idtlt absoluteUrl to object to fc.stringMatching()', () => {
    const validator = absoluteUrl;
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<typeof validator.T>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt absoluteUrl to object to fc.option()', () => {
    const validator = absoluteUrl.optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<typeof validator.T>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf booleanFromString', () => {
  it('can convert idtlt booleanFromString to fc.boolean()', () => {
    const validator = booleanFromString;
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<typeof validator.T>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt booleanFromString to fc.boolean()', () => {
    const validator = booleanFromString.optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<typeof validator.T>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf numberFromString', () => {
  it('can convert idtlt numberFromString to fc.oneOf(fc.float, fc.integer)', () => {
    const validator = numberFromString;
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<typeof validator.T>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt numberFromString to fc.oneOf(fc.float, fc.integer)', () => {
    const validator = numberFromString.optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<typeof validator.T>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf intFromString', () => {
  it('can convert idtlt intFromString to fc.boolean()', () => {
    const validator = intFromString;
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<typeof validator.T>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });

  it('can convert idtlt intFromString to fc.boolean()', () => {
    const validator = intFromString.optional();
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<typeof validator.T>>;

    fc.assert(fc.property(result, (v) => validator.validate(v).ok));
  });
});

describe('inputOf no passing tests', () => {
  it('can not convert idtlt tuple of object to fc.record()', () => {
    const validator = tuple(idtltInfo, idtltNotification);
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<[typeof idtltInfo.T, typeof idtltNotification.T]>>;

    fc.assert(fc.property(result, (v) => !validator.validate(v).ok));
  });

  it('can not convert idtlt tuple of array to fc.record()', () => {
    const validator = tuple(array(idtltInfo), idtltNotification);
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<[Array<typeof idtltInfo.T>, typeof idtltNotification.T]>>;

    fc.assert(fc.property(result, (v) => !validator.validate(v).ok));
  });

  it('can not convert idtlt tuple of array to fc.record()', () => {
    const validator = tuple(dictionary(string, idtltInfo), idtltNotification);
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<[{ [key: string]: typeof idtltInfo.T }, typeof idtltNotification.T]>>;

    fc.assert(fc.property(result, (v) => !validator.validate(v).ok));
  });

  it('can not convert idtlt tuple of literal to fc.tuple()', () => {
    const validator = tuple(literal('foo'), literal('bar'));
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<['foo', 'bar']>>;

    fc.assert(fc.property(result, (v) => !validator.validate(v).ok));
  });

  it('can not find length of idtlt dummy validator', () => {
    const validator = array(
      object({
        foo: literal('BigBunnyWithABrownPonyTail'),
        bar: literal(42),
      }),
    );
    const length = __guessTupleLength(validator);

    expectTypeOf(length).toEqualTypeOf<number | undefined>;

    expect(length).toBeUndefined();
  });

  it('can not find the types of idtlt dummy validator', () => {
    const validator = array(
      object({
        foo: literal('BigBunnyWithABrownPonyTail'),
        bar: literal(42),
      }),
    );
    const types = __guessTupleTypes(validator, 2);

    expect(types).toHaveLength(0);
  });

  it('can not convert idtlt discriminatedUnion to fc.union()', () => {
    const userSending = object({
      type: literal('sending'),
    });

    const userEditing = object({
      type: literal('editing'),
      currentText: string,
    });

    const validator = discriminatedUnion('type', userSending, userEditing);
    const result = inputOf(validator);

    expectTypeOf(result).toEqualTypeOf<Arbitrary<typeof validator.T>>;

    fc.assert(fc.property(result, (v) => !validator.validate(v).ok));
  });

  it('can not convert string validator with `and` operator to arb', () => {
    const validator = string.and((str) => (str.length > 3 ? Ok(str) : Err('No, that just won’t do')));
    const arb = inputOf(validator);

    fc.assert(
      fc.property(arb, (v) => {
        if (v.length > 3) {
          return validator.validate(v).ok;
        } else {
          return !validator.validate(v).ok;
        }
      }),
    );
  });
});

describe('example from the README.md', () => {
  it('should works fine', () => {
    const validator = array(
      object({
        id: string,
        article: array(
          object({
            id: string,
            author: string,
            created: isoDate,
            tag: union(literal('bunny'), literal('pony'), literal('fox')),
            content: string,
            published: boolean,
          }),
        ),
      }),
    );

    const arbitrary = inputOf(validator);

    fc.assert(fc.property(arbitrary, (v) => validator.validate(v).ok));
  });
});

describe('private function tests', () => {
  it('can convert string validator with default to fc.option()', () => {
    const defaultVal = 'default value';
    const validator = string.default(defaultVal);
    const arbWithDefault = __injectDefaultValue(fc.string(), defaultVal);

    fc.assert(
      fc.property(arbWithDefault, (v) => {
        if (v === defaultVal) {
          return true;
        } else {
          return validator.validate(v).ok;
        }
      }),
    );
  });

  it('can convert object validator with default to fc.option()', () => {
    const defaultVal = 'default value';
    const validator = object({ foo: string }).default(defaultVal);
    const arbWithDefault = __injectDefaultValue(fc.record({ foo: fc.string() }), defaultVal);

    fc.assert(
      fc.property(arbWithDefault, (v) => {
        if (v === defaultVal) {
          return true;
        } else {
          return validator.validate(v).ok;
        }
      }),
    );
  });

  it('can find the tuple length', () => {
    const validator = tuple(string, number, boolean);
    const length = __guessTupleLength(validator);

    expect(length).toBe(3);
  });

  it('can find the arbitraries of a given tuple', () => {
    const validator = tuple(string, number);
    const arbs = __guessTupleTypes(validator, 2);

    fc.assert(fc.property(fc.tuple(arbs[0], arbs[1]), (v) => string.validate(v[0]).ok && number.validate(v[1]).ok));
  });

  it('can map a bunch of type', () => {
    const validatorString = __mapTypeToIdtltType['string'];
    const validatorNumber = __mapTypeToIdtltType['number'];
    const validatorBoolean = __mapTypeToIdtltType['boolean'];
    const validatorNull = __mapTypeToIdtltType['null'];
    const validatorUndefined = __mapTypeToIdtltType['undefined'];
    const validatorIsoDate = __mapTypeToIdtltType['isoDate'];

    expect(Object.entries(__mapTypeToIdtltType)).toHaveLength(7);

    expect(validatorString.validate('foo').ok).toBeTruthy();
    expect(validatorString.validate(42).ok).toBeFalsy();

    expect(validatorNumber.validate(42).ok).toBeTruthy();
    expect(validatorNumber.validate('horse').ok).toBeFalsy();

    expect(validatorBoolean.validate(false).ok).toBeTruthy();
    expect(validatorBoolean.validate('bunny').ok).toBeFalsy();

    expect(validatorNull.validate(null).ok).toBeTruthy();
    expect(validatorNull.validate('fox').ok).toBeFalsy();

    expect(validatorUndefined.validate(undefined).ok).toBeTruthy();
    expect(validatorUndefined.validate('lemon').ok).toBeFalsy();

    expect(validatorIsoDate.validate(new Date().toISOString()).ok).toBeTruthy();
    expect(validatorIsoDate.validate(3.14159).ok).toBeFalsy();
  });
});
