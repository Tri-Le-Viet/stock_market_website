import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Home from "./Home.js";
import Stocks from "./Stocks.js";
import History from "./History.js";
import Quote from "./Quote.js";

import "../Style/App.css";


export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <h1 className="title">IFN666 Stock market app</h1>
        {(() => {
            let path = window.location.pathname;
            let search = window.location.search;

            function isActive(url) {
              if (path === url) {
                return "navbar_item active";
              }
              return "navbar_item";
            } 

            if ((path === "/quote" || path === "/history") && search.startsWith("?symbol=")) {
              return(
                <ul className="navbar">
                  <li className={isActive("/")}><a className="navlink" href="/">Home</a></li>
                  <li className={isActive("/stocks")}><a className="navlink" href="/stocks">Stocks</a></li>
                  <li className={isActive("/quote")}><a className="navlink" href={"/quote" + search}>Quotes</a></li>
                  <li className={isActive("/history")}><a className="navlink" href={"/history" + search}>History</a></li>
                </ul>
              )
            } else {
              return (
                <ul className="navbar">
                  <li className={isActive("/")}><a className="navlink" href="/">Home</a></li>
                  <li className={isActive("/stocks")}><a className="navlink" href="/stocks">Stocks</a></li>
                </ul>
              )
            }
        })()}
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/stocks" component={Stocks}/>
          <Route path="/quote" component={Quote}/>
          <Route path="/history" component={History}/>
        </Switch>
      </BrowserRouter>
      <footer>
        <div>Data provided by <a href="https://financialmodelingprep.com/developer/docs/">Financial Modeling Prep</a></div>
      </footer>
    </div>
  );
}