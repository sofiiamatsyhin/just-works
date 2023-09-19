async function fetchCurrencyRates() {
  try {
    const response = await fetch(
      'https://api.coinbase.com/v2/exchange-rates?currency=USD'
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data.rates;
  } catch (error) {
    throw new Error(`Error fetching exchange rates: ${error.message}`);
  }
}

export default {
  fetchCurrencyRates,
};
