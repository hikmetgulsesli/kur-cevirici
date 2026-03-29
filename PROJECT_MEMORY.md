# Project Memory

## Completed Stories
### US-007: Favoriler — Favorites component with empty state [done]
- Files: Created CurrencyList component with 6 currencies (BTC, ETH, USD, EUR, GBP, TRY). Crypto sorted before fiat. 24h change chips with green/red colors. Favorite toggle with localStorage persistence. Turkish UI text ("Kur Listesi" heading).

### US-005: Ana Cevirici — CurrencyConverter component [done]
- Files: Created src/services/coingecko.ts with CoinGecko API integration. Implemented getExchangeRates() returning TRY-based exchange rates for BTC ETH USD EUR GBP TRY. Implemented getChartData(coinId, days) returning 7-day chart data. 5-minute in-memory cache implemented with stale flag on rate limit. Rate limit handling returns stale cache with { stale: true }. Network errors throw Turkish error messages. Created src/types/index.ts with ExchangeRate, ChartData types.

### US-004: CurrencyContext and SettingsContext providers [done]
- Files: (see PR)

