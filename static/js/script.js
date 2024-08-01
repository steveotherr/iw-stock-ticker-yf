document.addEventListener("DOMContentLoaded", async function() {
    console.log("DOMContentLoaded event fired");

    const stockTickerContent = document.getElementById('ticker-content');
    const stockTickerContentDuplicate = document.getElementById('ticker-content-duplicate');
    const cacheTime = 60000; // 60 seconds
    let cache = JSON.parse(localStorage.getItem('stockCache')) || {};

    function createPlaceholders() {
        console.log("Creating placeholders");
        let tickerHTML = '';
        ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'META', 'BTC-USD', 'ETH-USD', 'DOGE-USD'].forEach(symbol => {
            tickerHTML += `<span class="stock" id="stock-${symbol.replace(/[:]/g, '-')}" style="margin-right: 20px;">${symbol}: Loading...</span>`;
        });
        stockTickerContent.innerHTML = tickerHTML;
        stockTickerContentDuplicate.innerHTML = tickerHTML;
    }

    async function fetchStockData() {
        console.log("Fetching stock data");
        try {
            const response = await fetch('https://iw-stock-ticker-yf.onrender.com/market-data');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Data fetched:", data);
            localStorage.setItem('stockCache', JSON.stringify({ data, timestamp: Date.now() }));
            return data;
        } catch (error) {
            console.error('Failed to fetch data:', error);
            return null;
        }
    }

    async function updateStockTicker() {
        const data = await fetchStockData();
        if (data) {
            Object.keys(data).forEach(symbol => {
                const elements = document.querySelectorAll(`#stock-${symbol.replace(/[:]/g, '-')}`);
                elements.forEach(element => {
                    if (element) {
                        const price = data[symbol] !== undefined ? data[symbol] : 'N/A';
                        element.innerHTML = `${symbol}: $${isNaN(price) ? 'N/A' : parseFloat(price).toFixed(2)}`;
                    }
                });
            });

            stockTickerContentDuplicate.style.left = `${stockTickerContent.offsetWidth}px`;
        } else {
            console.error("No data received to update ticker");
        }
    }

    createPlaceholders();
    updateStockTicker();
    setInterval(updateStockTicker, cacheTime);
});
