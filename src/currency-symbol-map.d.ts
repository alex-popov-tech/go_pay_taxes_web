declare module "currency-symbol-map" {
  declare function getSymbolFromCurrency (currencyCode: string): string | undefined
  declare const currencySymbolMap: Record<string, string>
  export = { getSymbolFromCurrency, currencySymbolMap }
}
