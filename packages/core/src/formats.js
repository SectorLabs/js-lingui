// @flow

import memoize from "fast-memoize"

type NumberFormat = string | {}
type DateFormat = string | {}

type IntlType = {|
  DateTimeFormat: Function,
  NumberFormat: Function
|}

declare var Intl: IntlType

const memoizedNumberFormat = memoize(
  (language, format) => new Intl.NumberFormat(language, format),
  {
    strategy: memoize.strategies.variadic
  }
)
const memoizedDateTimeFormat = memoize(
  (language, format) => new Intl.DateTimeFormat(language, format),
  {
    strategy: memoize.strategies.variadic
  }
)

export function date(
  locales?: ?string | string[],
  format?: DateFormat = {}
): (value: string) => string {
  const formatter = memoizedDateTimeFormat(locales, format)
  return value => formatter.format(value)
}

export function number(
  locales?: ?string | string[],
  format?: NumberFormat = {}
): (value: number) => string {
  const formatter = memoizedNumberFormat(locales, format)
  return value => formatter.format(value)
}
