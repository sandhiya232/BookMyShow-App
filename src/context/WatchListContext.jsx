import { createContext, useState ,useEffect} from "react";

export const WatchListContext = createContext();

export const WatchListProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [genreList,setGenreList] = useState([]);

      useEffect(() => {
          let url =  `https://api.themoviedb.org/3/genre/movie/list?api_key=25131d6b9753528e5fdfbacc1d982378`
  
          fetch (url).then((res) => res.json())
          .then((data) => setGenreList(data.genres));
      }, [])

  const togglewatchlist = (movie) => {
    const index = watchlist.findIndex((m) => m.id === movie.id);
    if (index === -1) {
      setWatchlist([...watchlist, movie]);
    } else {
      setWatchlist([
        ...watchlist.slice(0, index),
        ...watchlist.slice(index + 1),
      ]);
    }
  };

  return (
    <WatchListContext.Provider value={{ watchlist, togglewatchlist,genreList }}>
      {children}
    </WatchListContext.Provider>
  );
};