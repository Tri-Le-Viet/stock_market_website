import React, {useState, useEffect} from "react";

import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import "../Style/grid.css"
import "../Style/history.css"

import paginationSettings from "./paginationSetting.js";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Line } from 'react-chartjs-2';



export default function History() {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFiltered] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (rowData !== [] && !rowData["Error Message"] && rowData.length !== 0) {
      console.log(rowData);
      setStartDate(new Date(rowData[rowData.length - 1].date));
      setEndDate(new Date(rowData[0].date));
    }
  }, [rowData])

  useEffect (() => {
      function filterDates(data) {
        let data_date = new Date(data.date);
        return data_date >= startDate && data_date <= endDate;
      }

      if (rowData !== [] && !rowData["Error Message"]) {
        setFiltered(rowData.filter(filterDates));
      }

      if (gridApi) {
        gridApi.sizeColumnsToFit();
        gridApi.setDomLayout('autoHeight');
      }
  }, [startDate, endDate, rowData, gridApi])

  useEffect (() => {
    if (gridColumnApi) {
      gridColumnApi.sizeColumnsToFit();
    }
  }, [gridColumnApi])

  useEffect (() => {
    console.log("filtered");
    let dates = [];
    let close = [];
    
    for (let i = filteredData.length - 1; i >= 0; i--) {
      dates.push(filteredData[i]["date"]);
      close.push(filteredData[i]["close"]);
    }

    setChartData(
      {
        labels: dates,
        datasets: [
          {
            label: "Close price",
            data: close,
            backgroundColor: 'rgb(0, 154, 156)',
            borderColor: 'rgb(0, 154, 156)',
          }
        ]
      }
    );

  }, [filteredData])

  const options = {
    elements: {
      point: {
        radius: 0
      }
    }, maintainAspectRatio: false
  };

  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has("symbol")) {
    return (
      <div><a class="text_link" href="/stocks">No stock found, please specify a stock</a></div> // Need to specify which stock to display
    )
  }

  const symbol = urlParams.get("symbol");
  const api_url = "https://financialmodelingprep.com/api/v3/historical-price-full/" + symbol + "?apikey=" + process.env.REACT_APP_API_KEY;

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    fetch(api_url)
      .then((response) => response.json())
      .then((data) => setRowData(data.historical));
  };

  return (
    <div>
      {(() => {
        console.log(rowData["Error Message"]);
        if (rowData["Error Message"]) {
          return (
            <div>Failed to load data</div>
          )
        }
      })()}
      <h1>History of {symbol}</h1>
      <div>Select dates to display</div>
      <div>From: &nbsp;
        <DatePicker selected = {startDate} onChange={date => setStartDate(date)}></DatePicker><br/>
        To: &nbsp;
        <DatePicker selected = {endDate} onChange={date => setEndDate(date)}></DatePicker>
      </div>
      <div class="chart-container">
        <Line data={chartData} options={options} width={"100%"}/>
      </div>
      <br></br>
      {paginationSettings(gridApi)}
      <div className="ag-theme-alpine" style={{ height:800, width: "100%" }}>
        <AgGridReact pagination={true} paginationPageSize={10}
          onGridReady={onGridReady}
          rowData={filteredData}
        >
          <AgGridColumn headerName="Date" field="date" sortable={true}></AgGridColumn>
          <AgGridColumn headerName="Open" field="open" sortable={true}></AgGridColumn>
          <AgGridColumn headerName="High" field="high" sortable={true}></AgGridColumn>
          <AgGridColumn headerName="Low" field="low" sortable={true}></AgGridColumn>
          <AgGridColumn headerName="Close" field="close" sortable={true}></AgGridColumn>
          <AgGridColumn headerName="Volume" field="volume" sortable={true}></AgGridColumn>
        </AgGridReact>
      </div>
      
    </div>
  )
}