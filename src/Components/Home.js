import stocks from '../Images/stocks.png';

export default function Home() {
    return(
        <div>
        <h1 className="stock_explanation_heading">What are stocks?</h1>
        <p className="stock_explanation_body">
            A stock (also known as equity) is a security that represents the ownership of a fraction of a 
            corporation. This entitles the owner of the stock to a proportion of the corporation's assets and
            profits equal to how much stock they own. Units of stock are called "shares."
            Corporations issue (sell) stock to raise funds to operate their businesses. Stocks are bought
            and sold predominantly on stock exchanges, though there can be private sales as well, and
            are the foundation of many individual investors' portfolios. Historically, they have
            outperformed most other investments over the long run. 
            <br></br>
            Source: <a className="text_link" href="https://www.investopedia.com/terms/s/stock.asp">Investopedia</a>
        </p>
        <h1>How to use this app?</h1>
        <p>
            Navigate to the Stocks page to view a list of company stocks with their relevant industry. You can search for the stock you want and view 
            either a Quote for this stock or the History.
        </p>
        <img src={stocks} title="Stock image. Hehe get it?" alt="Stock chart" width="300" height="300"></img>
        </div>
    );
}