import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import eta from './services/eta';

function BusEtaInfo({ eta, route, dest, currentTime = new Date() }) {
  const waitingTimeInMinutes = (new Date(eta) - currentTime) / 1000 / 60

  return <tr className="bus-eta-info--container">
    <td><strong>{Math.ceil(waitingTimeInMinutes)} min</strong></td>
    <td>{route}</td>
    <td>{dest}</td>
  </tr>
}

function EtaDashboard({stop}) {
  const [etaList, setEtaList] = useState([]);

  useEffect(() => {
    async function fetchEta() {
      const etaList = await eta.fetchEta(stop)
      setEtaList(etaList)
    }

    fetchEta()
  }, [etaList.length, stop])

  return (
    <table>
      <tbody>
        {etaList
        .sort((a, b) =>  new Date(a.eta) - new Date(b.eta))
        .slice(0, 5)
        .map((eta, i) => <BusEtaInfo
          eta={eta.eta}
          route={eta.route}
          dest={eta.dest_tc}
          key={i}
        />)}
      </tbody>
    </table>)
}

EtaDashboard.propTypes = {
  stop: PropTypes.string
};

const STOP_GOLD_COAST_OUTBOUND = "001890"
const STOP_WEST_TUNNEL_INBOUND = "001628"
const KWONG_SANG_HONG_INBOUND = "002443"

function App() {


  return (
    <div className="App">
      <header className="App-header">
        <h3>→ 港島</h3>
        <EtaDashboard stop={STOP_GOLD_COAST_OUTBOUND} />
        <h3>西隧 → 屯門</h3>
        <EtaDashboard stop={STOP_WEST_TUNNEL_INBOUND}/>
        <h3>廣生行 → 屯門</h3>
        <EtaDashboard stop={KWONG_SANG_HONG_INBOUND}/>
      </header>
    </div>
  );
}

export default App;
