import './App.css'
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import LandingPage from  "./pages/landing/landing.jsx";
import HeaderPage from './pages/headerPage.jsx';

function App() {

  return (
    <>
    <Router>
      <HeaderPage/>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
      </Routes>

    </Router>
    </>
  )
}

export default App
