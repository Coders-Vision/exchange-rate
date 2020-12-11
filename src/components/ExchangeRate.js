import React, { useState, useEffect } from "react";
import currencies from "../currencies.json";

const DEFUALT_BASE = {
  currencies: [{ code: "USD", name: "United States dollar", symbol: "$" }],
  flag: "https://restcountries.eu/data/usa.svg",
};
const GLOBAL_CURRENCIES = [
  {
    currencies: [{ code: "EUR", name: "European euro", symbol: "€" }],
    flag:
      "https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg",
    rate: "0.000",
  },

  {
    currencies: [{ code: "GBP", name: "British pound", symbol: "£" }],
    flag: "https://restcountries.eu/data/gbr.svg",
    rate: "0.000",
  },
  {
    currencies: [{ code: "JPY", name: "Japanese yen", symbol: "¥" }],
    flag: "https://restcountries.eu/data/jpn.svg",
    rate: "0.000",
  },
];

const ExchangeRate = () => {
  const [date, setCurrencyDate] = useState("");
  const [showList, setShowList] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(GLOBAL_CURRENCIES);
  const [baseCurrency, setBaseCurrency] = useState(DEFUALT_BASE);
  const [baseAmount, setBaseAmount] = useState();
  const [search, setSearch] = useState("");
  const [updatedCurrency, setUpdatedCurrency] = useState([]);
  const [currencyRate, setCurrencyRate] = useState({});
  const [convertedValues, setConvertedValues] = useState([]);

  useEffect(() => {
    fetchRate(baseCurrency.currencies[0].code);
  }, [showList]);

  useEffect(() => {
    setRates();
  }, [currencyRate]);

  const fetchRate = (BASE_CURRENCY) => {
    fetch(`${process.env.REACT_APP_CURRENCY_URL}?base=${BASE_CURRENCY}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrencyDate(data.date);
        setCurrencyRate(data.rates);
      });
  };

  const setRates = () => {
    let copy = [...selectedCurrency];
    copy.forEach((copy) => (copy.rate = currencyRate[copy.currencies[0].code]));
    setSelectedCurrency(copy);
  };

  const checkCurrency = (cur) => {
    const checkList = selectedCurrency.some(
      (x) => x.currencies[0].code === cur
    );
    return checkList;
  };

  const baseToforeign = (e) => {
    setBaseAmount(e.target.value);
    let baseAmt = e.target.value;
    setConvertedValues([]);
    selectedCurrency.map((select, index) =>
      setConvertedValues((con) => [
        ...con,
        (baseAmt * select.rate).toFixed(3).toString(),
      ])
    );
  };

  const foreignToBase = (e) => {
    let forAmt = e.target.value;
    let inputIndex = e.target.id;
    let values = [...convertedValues];
    let value = values[inputIndex];
    value = forAmt;
    values[inputIndex] = value;
    setConvertedValues(values);
    let forToBase = parseFloat(
      forAmt / selectedCurrency[inputIndex].rate
    ).toFixed(3);
    setBaseAmount(forToBase);
  };
  const showupdatedCurrency = updatedCurrency.map((dat) => {
    return (
      <li
        className={
          checkCurrency(dat.currencies[0].code) ||
          baseCurrency.currencies[0].code === dat.currencies[0].code
            ? " checked"
            : ""
        }
        key={dat.currencies[0].code}
        onClick={(e) => {
          setSelectedCurrency((currency) => [...currency, dat]);
        }}
      >
        <img className="country-flag" src={dat.flag} alt="" />
        <span className="currency-name">
          {dat.currencies[0].code}-{dat.currencies[0].name}
        </span>
      </li>
    );
  });

  const searchCurrency = (e) => {
    let choosenCur = e.target.value.toLowerCase();
    setSearch(choosenCur);
    const val = currencies.filter((cur) => {
      return `${cur.currencies[0].code}-${cur.currencies[0].name}`
        .toLowerCase()
        .includes(choosenCur);
    });
    setUpdatedCurrency(val);
  };

  const addCurrency = selectedCurrency.map((cur, index) => {
    return (
      <li
        className="currency"
        onClick={(e) => {
          if (!(e.target.getAttribute("class") === "currency-field")) {
            fetchRate(cur.currencies[0].code);
            setBaseCurrency(cur);
            removeCurrency(cur.currencies[0].code);
          }
        }}
        key={cur.currencies[0].code}
      >
        <img className="country-flag" src={cur.flag} alt="" />
        <span className="currency-symbol">{cur.currencies[0].symbol}</span>
        <div className="currency-info">
          <input
            className="currency-field"
            value={convertedValues[index]}
            type="number"
            min="0.000"
            onChange={foreignToBase}
            placeholder="0.000"
            id={index}
          />
          <div className="currency-name">
            {cur.currencies[0].code}-{cur.currencies[0].name}
          </div>
          <div className="base-currency">
            1 {baseCurrency.currencies[0].code}= {cur.rate + " "}{" "}
            {cur.currencies[0].code}
          </div>
        </div>
        <span
          onClick={() => removeCurrency(cur.currencies[0].code)}
          className="close"
        >
          &times;
        </span>
      </li>
    );
  });

  const removeCurrency = (e) => {
    setSelectedCurrency(
      selectedCurrency.filter((cur) => cur.currencies[0].code !== e)
    );
  };

  return (
    <div className="container">
      <div className="app-header">
        <span>
          <svg
            onClick={() => setShowList(!showList)}
            className="ham"
            viewBox="0 0 100 80"
            width="40"
            height="40"
          >
            <rect width="100" height="20" rx="8"></rect>
            <rect y="30" width="100" height="20" rx="8"></rect>
            <rect y="60" width="100" height="20" rx="8"></rect>
          </svg>
        </span>
        <div className="app-title">Exchange Rate</div>
      </div>
      <div className="exchange-date">Rates Updated as of:{date}</div>
      <ul className="selected-currency">
        <li className="currency">
          <img className="country-flag" src={baseCurrency.flag} alt="" />
          <span className="currency-symbol">
            {baseCurrency.currencies[0].symbol}{" "}
          </span>
          <div className="currency-info">
            <input
              className="currency-field"
              type="number"
              min="0.000"
              placeholder="0.000"
              value={baseAmount}
              onChange={baseToforeign}
            />
            <div className="currency-name">
              {baseCurrency.currencies[0].code}-
              {baseCurrency.currencies[0].name}
            </div>
            <div className="base-currency">Selected Currency</div>
          </div>
        </li>
      </ul>
      <ul className="currencies"> {addCurrency}</ul>
      <ul className={!showList ? "currency-list close" : "currency-list show"}>
        <div className="search-bar-container">
          <div className="search-bar">
            <input
              className="search-currency"
              type="text"
              placeholder="Search (i.e USD)"
              value={search}
              onChange={searchCurrency}
            />
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </div>
        </div>
        {showupdatedCurrency}
      </ul>
    </div>
  );
};

export default ExchangeRate;
