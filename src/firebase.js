import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWRAbgHFgTlR_kkyhjcTXODpjU28Jjh3I",
  authDomain: "moviebookingapp-ec8c7.firebaseapp.com",
  projectId: "moviebookingapp-ec8c7",
  storageBucket: "moviebookingapp-ec8c7.appspot.com",
  messagingSenderId: "425449873534",
  appId: "1:425449873534:web:6cd78fa29a99f2fe28382f" // ✅ Use the real value you just got
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
