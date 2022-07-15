export interface TokenDetails {
  name: string
  symbol: string
  image: string
  decimal: number
  mint: string
  coingeckoId: string
  usdPrice?: number
}

export interface TokenDetailsState {
  loading: boolean
  fetchingPrice: boolean
  tokens: TokenDetails[]
  prices: { [key: string]: number }
  error: string
}
