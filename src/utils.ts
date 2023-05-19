import { xor } from 'lodash';

export function containSameElements<T>(arrA: Array<T>, arrB: Array<T>) {
  return xor(arrA, arrB).length === 0;
}

export function isStrValidNumber(str: string) {
  const num = Number(str);
  return num != null || !isNaN(num);
}
