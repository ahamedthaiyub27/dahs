
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Dash from './Pages/dashpage/Dash';
import Header from './Components/Headers/Header';
import Table from './Components/Table/Table';

import Orderpage from './Components/Orderpage/Orderpage';
import Cards from './Components/Cards/Cards';
import Contactcard from './Components/contactard/contact_card';

function App() {
  return (
   <>
   <BrowserRouter>
   <Header/>
   <Routes>
    <Route path='/' element={<Dash></Dash>}></Route>
    <Route path='/table' element={<Table/>}></Route>
    <Route path='/orderpage' element={<Orderpage/>}></Route>
      <Route path='/menu' element={<Cards/>}></Route>
        <Route path='/contact' element={<Contactcard/>}></Route>
   </Routes>
   </BrowserRouter>

   </>
  );
}

export default App;
