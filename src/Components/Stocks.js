import React, {useState, useEffect} from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import paginationSettings from "./paginationSetting.js";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "../Style/grid.css"
import "../Style/stocks.css"

export default function Stocks() {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("symbol");
  const [selectedIndustries, setSelectedIndustries] = useState({});
  
  const api_url = "https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=" + process.env.REACT_APP_API_KEY;  

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    fetch(api_url)
      .then((response) => response.json())
      .then((data) => setRowData(data));
  };

  useEffect (() => {
    if (gridColumnApi) {
      gridColumnApi.sizeColumnsToFit();
    }
  }, [gridColumnApi])
  
  useEffect (() => {
    let industries = [];
    for (let row in rowData) {
      let ind = rowData[row].sector;
      if (!industries.includes(ind)) {
        industries.push(ind);
        
      }
    }
    industries.sort();
    let selection = {};
    for (let ind in industries) {
      selection[industries[ind]] = true;
    }
    setSelectedIndustries(selection);
  }, [rowData])
  
  function searchStocks(data) { // select stocks
    if (selectedIndustries[data.sector]) {
      switch (searchType) {
        case "both":
          return data.symbol.toLowerCase().includes(searchTerm) || data.name.toLowerCase().includes(searchTerm);
        case "symbol":
          return data.symbol.toLowerCase().includes(searchTerm);
        case "name":
          return data.name.toLowerCase().includes(searchTerm);
        default:
          return false;
      }
    }
    return false;
  }
    
  useEffect (() => {
    if (rowData !== [] && !rowData["Error Message"]) {
      setFiltered(rowData.filter(searchStocks));
    }

    if (gridApi) { // resize grid
      gridApi.sizeColumnsToFit();
      gridApi.setDomLayout('autoHeight');
    }
  }, [rowData, searchTerm, searchType, selectedIndustries])

  const linkCellRenderer = (params) => {
    return (<a className="table_link" href={"/" + params.link + "?symbol=" + params.data.symbol}>Get {params.link} for {params.data.symbol}</a>)
  }

  function changeInd(ind) {
    selectedIndustries[ind] = !selectedIndustries[ind];
    if (rowData !== [] && !rowData["Error Message"]) {
      setFiltered(rowData.filter(searchStocks));
    }
  }

  function clearIndustries() {
    for (let ind in selectedIndustries) {
      selectedIndustries[ind] = true;
      document.getElementById(ind).checked = true; // not the neatest but it has to set each checkbox
    }
    if (rowData !== [] && !rowData["Error Message"]) {
      setFiltered(rowData.filter(searchStocks));
    }
  }

  return(
    <div>
      {(() => {
        console.log(rowData["Error Message"]);
        if (rowData["Error Message"]) {
          return (
            <div>Failed to load data</div>
          )
        }
      })()}
      <div className="search">
        <div className="text_search">
          <input type="text" id="search_text" placeholder="Search for stock" onChange={(e) => {setSearchTerm(e.target.value.toLowerCase())}}></input>
          <div>Search by: 
            <input type="radio" id="symbol_search" value="symbol" name="search" defaultChecked onChange={(e) => {setSearchType(e.target.value)}}/>
            <label htmlFor="symbol_search">Stock symbol</label>
            <input type="radio" id="name_search" value="name" name="search" onChange={(e) => {setSearchType(e.target.value.toLowerCase())}}/>
            <label htmlFor="name_search">Company name</label>
            <input type="radio" id="both_search" value="both" name="search" onChange={(e) => {setSearchType(e.target.value.toLowerCase())}}/>
            <label htmlFor="both_search">Both</label>
          </div>
        </div>
        <div className="ind_filt">Filter industry:
            <div className="industry_menu">
              {Object.keys(selectedIndustries).map((key) => 
                <div>
                  <span className={`industry ${selectedIndustries[key] ? "true": "false"}`}>
                    <input type="checkbox" onChange={() => changeInd(key)} defaultChecked name={key} id={key}></input>
                    <label htmlFor={key}>{key}</label>
                  </span>
                </div>
              )}
              <button onClick={clearIndustries}>Clear selection</button>
            </div>
        </div>
      </div>
      {paginationSettings(gridApi)}
      <div className="ag-theme-alpine" style={{width: "100%"}}>
      <AgGridReact 
        frameworkComponents = {{"linkCellRenderer":linkCellRenderer}}
        pagination={true} paginationPageSize={10}
        onGridReady={onGridReady}
        rowData={filteredData}
      >
        <AgGridColumn headerName="Stock Symbol" field="symbol" sortable={true}></AgGridColumn>
        <AgGridColumn headerName="Company Name" field="name" sortable={true}></AgGridColumn>
        <AgGridColumn headerName="Industry" field="sector" sortable={true}></AgGridColumn>
        <AgGridColumn headerName="Quotes" sortable={false} cellRenderer="linkCellRenderer"
          cellRendererParams={{"link":"quote"}}
        ></AgGridColumn>
        <AgGridColumn headerName="History" sortable={false} cellRenderer="linkCellRenderer"
          cellRendererParams={{"link":"history"}}
        ></AgGridColumn>
      </AgGridReact>
      </div>
    </div>
  )
}