import yfinance as yf
from flask import Flask, jsonify
from flask_cors import CORS
from time import time

app = Flask(__name__)
CORS(app)

cache = {}
cache_duration = 60  # Cache duration in seconds

@app.route('/market-data')
def get_market_data():
    symbols = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'META', 'BTC-USD', 'ETH-USD', 'DOGE-USD']
    data = {}
    current_time = time()
    
    for symbol in symbols:
        # Check if the symbol is in cache and still valid
        if symbol in cache and (current_time - cache[symbol]['timestamp'] < cache_duration):
            data[symbol] = cache[symbol]['price']
        else:
            # Fetch new data
            ticker = yf.Ticker(symbol)
            price = ticker.history(period='1d')['Close'].iloc[-1]
            data[symbol] = price
            # Update cache
            cache[symbol] = {'price': price, 'timestamp': current_time}
    
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
