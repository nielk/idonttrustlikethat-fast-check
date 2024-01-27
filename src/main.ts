import {
  option,
  constant,
  integer,
  string,
  stringMatching,
  oneof,
  float,
  boolean,
  Arbitrary,
  record,
  array,
  date,
  dictionary,
  tuple,
} from 'fast-check';
import {
  Validator,
  number,
  string as idtltString,
  boolean as idtltBoolean,
  null as idtltNull,
  undefined as idtltUndefined,
  isoDate,
  literal,
  object,
  array as idtltArray,
  dictionary as idtltDictionary,
  union,
  tuple as idtltTuple,
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
  | Validator<typeof idtltArray>
  | Validator<typeof idtltDictionary>
  | Validator<typeof union>
  | Validator<typeof idtltTuple>
  | Validator<typeof intersection>
  | Validator<typeof literal>;

type OfType<T> = T extends Validator<infer U> ? U : never;

type Arb<T extends AllowedInput> = Arbitrary<OfType<T>>;

function __injectDefaultValue<T extends AllowedInput, U>(arb: Arb<T>, defaultValue: U): Arb<T> {
  return option(arb, { nil: defaultValue }) as Arb<T>;
}

function matchArbitrary<T extends AllowedInput>(validator: T): Arb<T> {
  const defaultValue = constant(undefined);

  switch (true) {
    case validator.meta.tag === 'null': {
      return constant(null) as Arb<T>;
    }

    case validator.meta.tag === 'undefined': {
      return constant(undefined) as Arb<T>;
    }

    case validator.meta.tag === 'number': {
      return integer() as Arb<T>;
    }

    case validator.meta.tag === 'string' && validator.meta.logicalType === 'integer': {
      return integer().map((v) => `${v}`) as Arb<T>;
    }

    case validator.meta.tag === 'string' && validator.meta.logicalType === 'absoluteUrl': {
      const urlRegex = /^((http:|https:)(\/\/))(\w)+(\.)+([a-z])+$/;

      return stringMatching(urlRegex) as Arb<T>;
    }

    case validator.meta.tag === 'string' && validator.meta.logicalType === 'number': {
      return oneof(float({ noNaN: true }), integer()).map((v) => `${v}`) as Arb<T>;
    }

    case validator.meta.tag === 'string': {
      const arb = validator.validate('foobar').ok ? string() : date().map((v) => v.toISOString());

      return arb as Arb<T>;
    }

    case validator.meta.tag === 'boolean': {
      return boolean() as Arb<T>;
    }

    case Object.hasOwn(validator, 'literal'): {
      const v = validator as unknown as { literal: string };

      return constant(v.literal) as Arb<T>;
    }

    case validator.meta.tag === 'object' || validator.meta.tag === 'intersection': {
      const props = Object.fromEntries(
        Object.entries<Validator<T>>(validator.meta.props).map(([k, v]) => [k, inputOf(v)]),
      );

      return record(props) as Arb<T>;
    }

    case validator.meta.tag === 'array': {
      const innerValue = inputOf(validator.meta.value);

      return array(innerValue) as Arb<T>;
    }

    case validator.meta.tag === 'dictionary': {
      return dictionary(string(), inputOf(validator.meta.value)) as Arb<T>;
    }

    case validator.meta.tag === 'tuple': {
      const expectedTupleLength = __guessTupleLength(validator) ?? 0;
      const expectedTupleTypes = __guessTupleTypes(validator, expectedTupleLength);

      return tuple(...expectedTupleTypes) as Arb<T>;
    }

    case validator.meta.tag === 'union' && validator.meta.tag !== 'tuple': {
      const types = validator.meta.union.map(inputOf);

      return oneof(...types) as Arb<T>;
    }

    default: {
      return defaultValue as Arb<T>;
    }
  }
}

function inputOf<T extends AllowedInput>(validator: T): Arb<T> {
  const arb = matchArbitrary(validator);

  if (validator.meta.optional) {
    return option(arb, { nil: undefined }) as Arb<T>;
  } else if (validator.meta.nullable) {
    return option(arb, { nil: null }) as Arb<T>;
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
  string: idtltString,
  boolean: idtltBoolean,
  isoDate: isoDate,
};
function __guessTupleTypes<T extends AllowedInput>(validator: T, numberOfTypes: number): ReadonlyArray<Arb<T>> {
  const dummyValidation = validator.validate(
    Array.from({ length: numberOfTypes }).fill({
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
