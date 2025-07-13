import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ServiceOrderForm from './pages/ServiceOrderForm';
import OrderTable from './components/OrderTable';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ServiceOrderForm />} />
        <Route path="/admin" element={<OrderTable />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
