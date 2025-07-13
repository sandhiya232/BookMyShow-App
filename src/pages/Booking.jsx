import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// Seat layout generator
const seatRows = ["A", "B", "C", "D", "E", "F"];
const seatLayout = seatRows.flatMap((row, i) =>
  Array.from({ length: 5 }, (_, j) => ({
    label: `${row}${j + 1}`,
    type: i < 2 ? "premium" : "normal",
  }))
);

const getSeatPrice = (type) => (type === "premium" ? 200 : 150);

export default function Booking() {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const showTime = location.state?.time || "Not selected";

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email);
      else navigate("/login");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const booked = await axios.get(`https://movie-booking-backend-8koe.onrender.com/api/bookings/${movieId}`);
        setBookedSeats(booked.data.bookedSeats);

        const movieRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=25131d6b9753528e5fdfbacc1d982378&language=en-US`
        );
        setMovieDetails(movieRes.data);
      } catch (err) {
        console.error("❌ Error loading booking data", err);
        alert("Failed to load movie details.");
      }
    };
    fetchDetails();
  }, [movieId]);

  const toggleSeat = (label) => {
    if (bookedSeats.includes(label)) return;
    setSelectedSeats((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const API = import.meta.env.VITE_API_URL;

  const handleConfirm = async () => {
    try {
      await axios.post(`${API}/api/bookings`, {
        movieId,
        userEmail,
        seats: selectedSeats,
        movieTitle: movieDetails?.title,
        showTime,
        posterPath: movieDetails?.poster_path,
      });

      const price = selectedSeats.reduce((sum, label) => {
        const seat = seatLayout.find((s) => s.label === label);
        return sum + getSeatPrice(seat?.type);
      }, 0);

      const bookingData = {
        email: userEmail,
        seats: selectedSeats,
        price,
        time: new Date().toLocaleString(),
        showTime,
        movie: movieDetails,
      };

      localStorage.setItem("latestBooking", JSON.stringify(bookingData));
      navigate("/summary");
    } catch (err) {
      alert("❌ Booking failed. Try again.");
    }
  };

  const totalPrice = selectedSeats.reduce((sum, label) => {
    const seat = seatLayout.find((s) => s.label === label);
    return sum + getSeatPrice(seat?.type);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">🎟 Book Your Seats</h1>
        <p className="text-center text-lg text-gray-400 mb-8">
          <strong>🕰 Show Time:</strong> {showTime}
        </p>

        {/* Legend */}
        <div className="flex justify-center gap-4 mb-6 text-sm">
          <Legend color="bg-gray-600" label="Normal ₹150" />
          <Legend color="bg-blue-500" label="Premium ₹200" />
          <Legend color="bg-green-600" label="Selected" />
          <Legend color="bg-red-600" label="Booked" />
        </div>

        {/* Seats Grid */}
        <div className="grid grid-cols-5 gap-4 justify-center mb-6">
          {seatLayout.map((seat) => {
            const isBooked = bookedSeats.includes(seat.label);
            const isSelected = selectedSeats.includes(seat.label);
            const base = seat.type === "premium" ? "bg-blue-500" : "bg-gray-600";

            const cls = isBooked
              ? "bg-red-600 text-white cursor-not-allowed"
              : isSelected
              ? "bg-green-600 text-white"
              : `${base} text-white hover:brightness-110`;

            return (
              <div
                key={seat.label}
                onClick={() => toggleSeat(seat.label)}
                className={`w-14 h-14 flex items-center justify-center rounded font-semibold cursor-pointer transition ${cls}`}
              >
                {seat.label}
              </div>
            );
          })}
        </div>

        {/* Selected Seats Info */}
        {selectedSeats.length > 0 && (
          <div className="text-center mb-6 text-lg">
            <p>
              🎫 <strong>Seats:</strong> {selectedSeats.join(", ")} | 💰{" "}
              <strong>Price: ₹{totalPrice}</strong>
            </p>
          </div>
        )}

        {/* Confirm Button */}
        <div className="text-center">
          <button
            onClick={handleConfirm}
            disabled={selectedSeats.length === 0}
            className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-lg font-semibold shadow disabled:opacity-50"
          >
            ✅ Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded ${color}`}></div>
      <span className="text-gray-300">{label}</span>
    </div>
  );
}
