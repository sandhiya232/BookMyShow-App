import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const showTimes = [
    { label: "Morning", value: "10:00 AM - 12:30 PM" },
    { label: "Afternoon", value: "2:00 PM - 4:30 PM" },
    { label: "Night", value: "7:00 PM - 9:30 PM" },
  ];

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=25131d6b9753528e5fdfbacc1d982378&language=en-US`
      );
      const data = await res.json();
      setMovie(data);
    };
    fetchMovie();
  }, [id]);

  const handleBook = () => {
    navigate(`/book/${movie.id}`, { state: { time: selectedTime } });
  };

  if (!movie)
    return <div className="p-10 text-center text-2xl text-gray-300 bg-gray-900 h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Poster */}
        <div className="w-full md:w-1/3">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-xl shadow-2xl w-full"
          />
        </div>

        {/* Movie Info */}
        <div className="flex-1 space-y-5">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-gray-400">Language: {movie.original_language}</p>
          <p className="text-gray-200">{movie.overview}</p>

          {/* Showtime Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-3">🎥 Select Show Time</h2>
            <div className="flex gap-3 flex-wrap">
              {showTimes.map((time) => (
                <button
                  key={time.label}
                  onClick={() => setSelectedTime(time.value)}
                  className={`px-4 py-2 rounded-full border transition duration-200
                    ${
                      selectedTime === time.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
                    }`}
                >
                  {time.label} ({time.value})
                </button>
              ))}
            </div>
          </div>

          {/* Book Button */}
          <button
            onClick={handleBook}
            disabled={!selectedTime}
            className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎟 Book Tickets
          </button>
        </div>
      </div>
    </div>
  );
}
