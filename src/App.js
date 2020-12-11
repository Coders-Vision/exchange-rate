import { useState } from "react";
import ExchangeRate from "./components/ExchangeRate";
import "./styles/exchange-rates.css";

function App() {
  const [exchangeRates, setExchangeRates] = useState();

  return (
    <div className="app">
      <ExchangeRate rates={exchangeRates} />
    </div>
  );
}

export default App;
