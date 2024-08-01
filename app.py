import yfinance as yf
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/market-data')
def get_market_data():
    symbols = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'META', 'BTC-USD', 'ETH-USD', 'DOGE-USD']
    data = {}
    for symbol in symbols:
        ticker = yf.Ticker(symbol)
        price = ticker.history(period='1d')['Close'].iloc[-1]
        data[symbol] = price
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
