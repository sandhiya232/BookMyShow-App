import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { WatchListProvider } from './context/WatchListContext';
import MovieDetail from "./pages/MovieDetail";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Added
import BookingSummary from "./pages/BookingSummary";
import MyBookings from "./pages/MyBookings";


function App() {
  return (
    <WatchListProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          
          {/* ✅ Protected Booking Route */}
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
           <Route path="/my-bookings" element={<MyBookings />} /> {/* ✅ new route */}
          <Route path="/summary" element={<BookingSummary />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </WatchListProvider>
  );
}

export default App;
