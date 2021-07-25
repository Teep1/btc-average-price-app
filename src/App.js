
import React, { useState, useEffect } from "react";
import axios from 'axios'
import './App.css';
import NumberFormat from 'react-number-format'

function AvgPrice(totalData){
  var total = 0;
  for(var i = 0; i < totalData.prices.length; i++) {
    total += parseInt(totalData.prices[i][1] * 100) / 100;
  }
  var avg = total / totalData.prices.length;

  return avg;
}

//Convert human readable date to epoch
function convertDate(date){
  var epochDate = new Date(date);
  epochDate = epochDate.getTime()/1000;
  console.log(epochDate);
  return epochDate;
};

const App = () => {

  const [start, setStart] = useState(1626480000);
  const [end, setEnd] = useState(1627084800);
  const [totalData, setData] = useState([]);
  const [avg, setAvg] = useState(35000);

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from='+
      start + '&to=' + end)
    .then(res => {
      setData(res.data);
      console.log(res.data);  
    }).catch(error => alert('Somethings gone wrong'))
  }, [start, end]);

  React.useEffect(() => {
    const parsedAverage = Number(localStorage.getItem("avg"))
    setAvg(parsedAverage)
  }, [])

  React.useEffect(() => {
    localStorage.setItem("avg", avg)
  }, [avg])

  function handleSubmit(e){
    setAvg(AvgPrice(totalData))
  }
  
  return (

    <div className="bitcoin-app" >
      <h5>Bitcoin's average price: </h5>
      <div>
       <b><h1><NumberFormat value={avg.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h1></b>
        <form onSubmit={handleSubmit}>
          From: <input type="date" name="from" onChange={e => setStart(convertDate(e.target.value))}/>
          To: <input type="date" name="To" onChange={e => setEnd(convertDate(e.target.value))}/>
          <div>
            <button className='button'> Update </button>
          </div>
        </form>

      </div>
    </div>
    );
}

export default App;


