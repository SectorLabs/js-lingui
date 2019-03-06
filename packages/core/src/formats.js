// @flow

import memoize from "fast-memoize"
import { isString } from "./essentials"

import type { Locales } from "./i18n"

export type NumberFormat = string | {}
export type DateFormat = string | {}

export type IntlType = {|
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
  locales: Locales,
  format?: DateFormat = {}
): (value: string | Date) => string {
  const formatter = memoizedDateTimeFormat(locales, format)
  return value => {
    if (isString(value)) value = new Date(value)
    return formatter.format(value)
  }
}

export function number(
  locales: Locales,
  format?: NumberFormat = {}
): (value: number) => string {
  const formatter = memoizedNumberFormat(locales, format)
  return value => formatter.format(value)
}
