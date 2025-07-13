import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await axios.get(
           `${API}/api/bookings/user/${user.email}`
          );
          setBookings(res.data.bookings);
        } catch (err) {
          console.error("❌ Failed to load bookings:", err);
        }
      }
    });
    return () => unsub();
  }, []);

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-400 flex items-center justify-center text-xl">
        You haven't booked any tickets yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-red-400">
          🎟️ My Bookings
        </h1>

        <div className="space-y-10">
          {bookings.map((b, i) => {
            const bookingTime = b?.lastBooking?.timestamp
              ? new Date(b.lastBooking.timestamp).toLocaleString()
              : "N/A";

            return (
              <div
                key={i}
                className="flex flex-col md:flex-row bg-gray-900 rounded-xl shadow-xl overflow-hidden"
              >
                {/* Poster */}
                <div className="md:w-1/3 w-full">
                  {b.posterPath ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w342${b.posterPath}`}
                      alt={b.movieTitle}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="bg-gray-700 w-full h-64 flex items-center justify-center text-gray-300 text-lg">
                      No Poster
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="md:w-2/3 w-full p-6 flex flex-col justify-center space-y-3 text-base md:text-lg">
                  <p>
                    <span className="font-semibold text-white">🎬 Movie:</span>{" "}
                    <span className="text-gray-300">{b.movieTitle || "N/A"}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-white">🪑 Seats:</span>{" "}
                    <span className="text-gray-300">{b.seats?.join(", ") || "None"}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-white">🕰️ Showtime:</span>{" "}
                    <span className="text-gray-300">{b.showTime || "N/A"}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-white">💰 Price:</span>{" "}
                    <span className="text-green-400 font-semibold">
                      ₹{b.lastBooking?.totalPrice || 0}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-white">⏰ Booked At:</span>{" "}
                    <span className="text-gray-400">{bookingTime}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
