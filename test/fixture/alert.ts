import { array, isoDate, literal, number, object, string, union } from 'idonttrustlikethat';

const idtltType = union(literal('Foo'), literal('Bar'), literal('Baz'));

const idtltSeverity = union(literal('Low'), literal('Medium'), literal('High'));

const idtltLatLng = object({
  lat: string,
  long: string,
});

export const idtltInfo = object({
  description: string,
  created: isoDate,
  comment: string.optional(),
});

type PhoneNumber = string & { __tag: 'PhoneNumber' };

const idtltPhoneNumber = string.tagged<PhoneNumber>();

export const idtltLocation = object({
  updated: isoDate,
  type: idtltInfo,
  phoneNumber: idtltPhoneNumber,
  location: idtltLatLng.optional(),
});

export const idtltNotification = object({
  id: string,
  created: isoDate,
  updated: isoDate,
  type: idtltType,
  severity: idtltSeverity,
  info: idtltInfo.optional(),
  location: idtltLocation,
  context: string.optional(),
  description: string,
  history: array(idtltLocation),
  note: number.optional(),
});
