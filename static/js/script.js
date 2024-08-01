document.addEventListener("DOMContentLoaded", async function() {
    const stockTickerContent = document.getElementById('ticker-content');
    const stockTickerContentDuplicate = document.getElementById('ticker-content-duplicate');
    const cacheTime = 60000;
    let cache = JSON.parse(localStorage.getItem('stockCache')) || {};

    function createPlaceholders() {
        let tickerHTML = '';
        ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'META', 'BTC-USD', 'ETH-USD', 'DOGE-USD'].forEach(symbol => {
            tickerHTML += `<span class="stock" id="stock-${symbol.replace(/[:]/g, '-')}" style="margin-right: 20px;">${symbol}: Loading...</span>`;
        });
        stockTickerContent.innerHTML = tickerHTML;
        stockTickerContentDuplicate.innerHTML = tickerHTML;
    }

    async function fetchStockData(symbol) {
        if (cache[symbol] && (Date.now() - cache[symbol].timestamp < cacheTime)) {
            return cache[symbol].data;
        }
        try {
            const response = await fetch('https://your-deployed-flask-app.herokuapp.com/crypto-data');
            const data = await response.json();
            cache[symbol] = { data, timestamp: Date.now() };
            localStorage.setItem('stockCache', JSON.stringify(cache));
            return data;
        } catch (error) {
            console.error(`Failed to fetch data for ${symbol}:`, error);
            return null;
        }
    }

    async function updateStockTicker() {
        const symbols = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'META', 'BTC-USD', 'ETH-USD', 'DOGE-USD'];
        const promises = symbols.map(symbol => fetchStockData(symbol));
        const stockDataArray = await Promise.all(promises);

        stockDataArray.forEach((stockData, index) => {
            const symbol = symbols[index];
            const elements = document.querySelectorAll(`#stock-${symbol.replace(/[:]/g, '-')}`);
            elements.forEach(element => {
                if (element) {
                    const price = stockData ? stockData[symbol] : 'N/A';
                    element.innerHTML = `${symbol}: $${isNaN(price) ? 'N/A' : parseFloat(price).toFixed(2)}`;
                }
            });
        });

        stockTickerContentDuplicate.style.left = `${stockTickerContent.offsetWidth}px`;
    }

    createPlaceholders();
    updateStockTicker();
    setInterval(updateStockTicker, cacheTime);
});
