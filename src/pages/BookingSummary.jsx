import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingSummary() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const booking = JSON.parse(localStorage.getItem("latestBooking"));
    if (booking) {
      setData(booking);
    } else {
      navigate("/");
    }
  }, []);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        `🎟️ Movie Ticket\n\n` +
          `Movie: ${data.movie.title}\n` +
          `Email: ${data.email}\n` +
          `Seats: ${data.seats.join(", ")}\n` +
          `Showtime: ${data.showTime}\n` +
          `Price: ₹${data.price}\n` +
          `Time: ${data.time}\n`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${data.movie.title}-Ticket.txt`;
    document.body.appendChild(element);
    element.click();
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500 text-xl">
        ❌ Booking details not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6 md:p-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-red-400">
          🎉 Booking Summary
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3 w-full">
            <img
              src={`https://image.tmdb.org/t/p/w500${data.movie.poster_path}`}
              alt={data.movie.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Info */}
          <div className="md:w-2/3 w-full space-y-4 text-lg">
            <p>
              <strong>🎬 Movie:</strong>{" "}
              <span className="text-gray-300">{data.movie.title}</span>
            </p>
            <p>
              <strong>📧 Email:</strong>{" "}
              <span className="text-gray-300">{data.email}</span>
            </p>
            <p>
              <strong>🪑 Seats:</strong>{" "}
              <span className="text-gray-300">{data.seats.join(", ")}</span>
            </p>
            <p>
              <strong>🕰️ Showtime:</strong>{" "}
              <span className="text-gray-300">{data.showTime}</span>
            </p>
            <p>
              <strong>💰 Price:</strong>{" "}
              <span className="text-green-400 font-semibold">
                ₹{data.price}
              </span>
            </p>
            <p>
              <strong>⏰ Booking Time:</strong>{" "}
              <span className="text-gray-300">{data.time}</span>
            </p>
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center mt-10">
          <button
            onClick={handleDownload}
            className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg font-medium shadow-lg"
          >
            ⬇️ Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
