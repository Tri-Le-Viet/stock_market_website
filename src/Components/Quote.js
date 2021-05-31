import React, {useState, useEffect} from "react";

export default function Quote() {
  const [quote, setQuote] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loaded, setLoaded] = useState(false);
  

  useEffect (() => {
    const symbol = urlParams.get("symbol");
    const quote_url = "https://financialmodelingprep.com/api/v3/quote/" + symbol + "?apikey=" + process.env.REACT_APP_API_KEY;
    const profile_url = "https://financialmodelingprep.com/api/v3/profile/" + symbol + "?apikey=" + process.env.REACT_APP_API_KEY;

    fetch(quote_url)
    .then((response) => response.json())
    .then((data) => setQuote(data[0]));

    fetch(profile_url)
    .then((response) => response.json())
    .then((data) => setProfile(data[0]));

  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has("symbol")) {
    return (
      <div><a class="text_link" href="/stocks">No stock found, please specify a stock</a></div> // Need to specify which stock to display
    )
  }

  
  if (quote && profile) { //ensure data is properly loaded
    return(
      <div>
        <h1>{profile["companyName"]}, {profile["symbol"]}</h1>
        <div>
          <p>{profile["description"]}</p>
          <img src={profile["image"]} alt={profile["companyName"] + "'s logo"}></img>
        </div>
        <br></br>
        <p><b>Exchange:</b> {profile["exchange"]}</p>
        <p><b>Sector:</b> {profile["industry"]}</p>
        <p><b>Current price:</b> {quote["price"]}</p>
        <p><b>Today's high/low:</b> {quote["dayHigh"]}/{quote["dayHigh"]}</p>
        <p><b>Share volume:</b> {quote["volume"]}</p>
        <p><b>Average volume:</b> {quote["avgVolume"]}</p>
        <p><b>Previous close:</b> {quote["previousClose"]}</p>
        <p><b>Last year high/low:</b> {quote["yearHigh"]}/{quote["yearLow"]}</p>
        <p><b>Market cap:</b> {quote["marketCap"]}</p>
        <p><b>P/E Ratio:</b> {quote["pe"]}</p>
        <p><b>Earnings Per Share(EPS): </b> {quote["eps"]}</p>
      </div>
    )
  } else {
    return (
      <div>Loading data...</div>
    )
  }
}