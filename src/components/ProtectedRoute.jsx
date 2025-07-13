import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        alert("❗ Please login to access this page.");
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return children;
}
