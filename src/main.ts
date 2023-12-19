import fc, { Arbitrary } from 'fast-check';
import {
  Validator,
  number,
  string,
  boolean,
  null as idtltNull,
  undefined as idtltUndefined,
  isoDate,
  literal,
  object,
  array,
  dictionary,
  union,
  tuple,
  intersection,
  unknown,
} from 'idonttrustlikethat';

type AllowedInput =
  | Validator<null>
  | Validator<undefined>
  | Validator<unknown>
  | Validator<number>
  | Validator<string>
  | Validator<boolean>
  | Validator<typeof object>
  | Validator<Date>
  | Validator<typeof array>
  | Validator<typeof dictionary>
  | Validator<typeof union>
  | Validator<typeof tuple>
  | Validator<typeof intersection>
  | Validator<typeof literal>;

type OfType<T> = T extends Validator<infer U> ? U : never;

type Arb<T extends AllowedInput> = Arbitrary<OfType<T>>;

function __injectDefaultValue<T extends AllowedInput, U>(arb: Arb<T>, defaultValue: U): Arb<T> {
  return fc.option(arb, { nil: defaultValue }) as Arb<T>;
}

function matchArbitrary<T extends AllowedInput>(validator: T): Arb<T> {
  const defaultValue = fc.constant(undefined);

  switch (true) {
    case validator.meta.tag === 'null': {
      return fc.constant(null) as Arb<T>;
    }

    case validator.meta.tag === 'undefined': {
      return fc.constant(undefined) as Arb<T>;
    }

    case validator.meta.tag === 'number': {
      return fc.integer() as Arb<T>;
    }

    case validator.meta.tag === 'string' && validator.meta.logicalType === 'integer': {
      return fc.integer().map((v) => `${v}`) as Arb<T>;
    }

    case validator.meta.tag === 'string' && validator.meta.logicalType === 'absoluteUrl': {
      const urlRegex = /^((http:|https:)(\/\/))(\w)+(\.)+([a-z])+$/;

      return fc.stringMatching(urlRegex) as Arb<T>;
    }

    case validator.meta.tag === 'string' && validator.meta.logicalType === 'number': {
      return fc.oneof(fc.float({ noNaN: true }), fc.integer()).map((v) => `${v}`) as Arb<T>;
    }

    case validator.meta.tag === 'string': {
      const arb = validator.validate('foobar').ok ? fc.string() : fc.date().map((v) => v.toISOString());

      return arb as Arb<T>;
    }

    case validator.meta.tag === 'boolean': {
      return fc.boolean() as Arb<T>;
    }

    case Object.hasOwn(validator, 'literal'): {
      const v = validator as unknown as { literal: string };

      return fc.constant(v.literal) as Arb<T>;
    }

    case validator.meta.tag === 'object' || validator.meta.tag === 'intersection': {
      const props = Object.fromEntries(
        Object.entries<Validator<T>>(validator.meta.props).map(([k, v]) => [k, inputOf(v)]),
      );

      return fc.record(props) as Arb<T>;
    }

    case validator.meta.tag === 'array': {
      const innerValue = inputOf(validator.meta.value);

      return fc.array(innerValue) as Arb<T>;
    }

    case validator.meta.tag === 'dictionary': {
      return fc.dictionary(fc.string(), inputOf(validator.meta.value)) as Arb<T>;
    }

    case validator.meta.tag === 'tuple': {
      const expectedTupleLength = __guessTupleLength(validator) ?? 0;
      const expectedTupleTypes = __guessTupleTypes(validator, expectedTupleLength);

      return fc.tuple(...expectedTupleTypes) as Arb<T>;
    }

    case validator.meta.tag === 'union' && validator.meta.tag !== 'tuple': {
      const types = validator.meta.union.map(inputOf);

      return fc.oneof(...types) as Arb<T>;
    }

    default: {
      return defaultValue as Arb<T>;
    }
  }
}

function inputOf<T extends AllowedInput>(validator: T): Arb<T> {
  const arb = matchArbitrary(validator);

  if (validator.meta.optional) {
    return fc.option(arb, { nil: undefined }) as Arb<T>;
  } else if (validator.meta.nullable) {
    return fc.option(arb, { nil: null }) as Arb<T>;
  }

  if (validator.meta.default) {
    return __injectDefaultValue(arb, validator.meta.default) as Arb<T>;
  }

  return arb as Arb<T>;
}

function __guessTupleLength<T>(validator: Validator<T>): number | undefined {
  const errorPattern = /Expected Tuple(?<length>\d), got Tuple\d/gm;

  const dummyValidation = validator.validate([{ foo: 'BigBunnyWithABrownPonyTail', bar: 42 }]);

  if (dummyValidation.ok) {
    console.error('not supported idtlt validator provided');
    return undefined;
  }

  let realLength = 0;

  for (const error of dummyValidation.errors) {
    const matches = error.message.matchAll(errorPattern);

    for (const match of matches) {
      const length = parseInt(match?.groups?.length || '0');

      realLength += length;
    }
  }

  return realLength;
}

const __mapTypeToIdtltType: { [k: string]: AllowedInput } = {
  null: idtltNull,
  undefined: idtltUndefined,
  unknown: unknown,
  number: number,
  string: string,
  boolean: boolean,
  isoDate: isoDate,
};
function __guessTupleTypes<T extends AllowedInput>(validator: T, numberOfTypes: number): ReadonlyArray<Arb<T>> {
  const dummyValidation = validator.validate(
    new Array(numberOfTypes).fill({
      foo: 'BigBunnyWithABrownPonyTail',
      bar: 42,
    }),
  );
  const inferredTypes: Array<Arb<T>> = [];

  if (dummyValidation.ok) {
    console.error('not supported idtlt validator provided');

    return inferredTypes;
  }

  for (const error of dummyValidation.errors) {
    const matches = error.message.matchAll(/Expected\s(?<type>\w+), got a?/gm);

    for (const match of matches) {
      const matchedType = match?.groups?.type;

      if (
        matchedType !== undefined &&
        matchedType !== 'undefined' &&
        matchedType !== 'object' &&
        matchedType !== 'array' &&
        !Array.isArray(matchedType)
      ) {
        const type = __mapTypeToIdtltType[matchedType];
        inferredTypes.push(inputOf(type) as Arb<T>);
      } else if (matchedType !== 'undefined') {
        console.error('Union with non-primitive values is not yet supported');
      }
    }
  }

  return inferredTypes;
}

export { inputOf, __injectDefaultValue, __guessTupleTypes, __guessTupleLength, __mapTypeToIdtltType };
