/**
 * Get a deep copy of provided source.
 *
 * @param source - Object, array or value to copy.
 *
 * @returns copy
 */
export function deepCopy<Source extends any>(source: Source): Source {
  let copy: any;

  // ### Object Check
  // If the source is not an array or object or is a date we return the source value as is.

  if (!source || typeof source !== "object" || Object.prototype.toString.call(source) === "[object Date]") {
    return source;
  }

  // ### Array
  // If the source is an array we create a new array and deep copy each entry.

  if (Array.isArray(source)) {
    copy = [];
    for (let i = 0, len = source.length; i < len; i++) {
      copy[i] = deepCopy(source[i]);
    }
    return copy;
  }

  // ### Object
  // If source is a plain object we create a new object and deep copy each key.

  copy = {};
  for (const key in source) {
    copy[key] = deepCopy(source[key]);
  }
  return copy;
}
