import logo from './logo.svg';
import './App.css';
import Registration from './components/Registration';
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Setting from './components/Setting'
import Home from './components/Home';
import GenerateInvoice from './components/GenerateInvoice';
import Records from './components/Records';

function App() {
  return (
    <div >
      <Router>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/regis" exact element={<Registration />} />
          <Route path="/dash" exact element={<Dashboard />} >
            <Route path="" exact element={<Home />} />
            <Route path="setting" exact element={<Setting />} />
            <Route path="records" exact element={<Records />} />
            <Route path="genInvoice" exact element={<GenerateInvoice />} />
          </Route>
          {/* <Route path="/experiences" element={<Experiences />} /> */}
        </Routes>
      </Router>

    </div>
  );
}

export default App;
