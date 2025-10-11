export async function fetchBitcoinPrice(): Promise<number | null> {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
      const data = await response.json()
      return data.bitcoin?.usd || null
    } catch (error) {
      console.error("Failed to fetch Bitcoin price:", error)
      return null
    }
  }
  
  export async function fetchCryptoPrice(coinId: string): Promise<number | null> {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`)
      const data = await response.json()
      return data[coinId]?.usd || null
    } catch (error) {
      console.error(`Failed to fetch ${coinId} price:`, error)
      return null
    }
  }
  
  export async function fetchHistoricalPrices(
    coinId: string,
    days = 30,
  ): Promise<Array<{ timestamp: number; price: number }>> {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      )
      const data = await response.json()
      return data.prices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price,
      }))
    } catch (error) {
      console.error(`Failed to fetch historical prices for ${coinId}:`, error)
      return []
    }
  }
  