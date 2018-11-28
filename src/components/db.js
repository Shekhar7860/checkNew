import Firebase from 'firebase';
 let config = {
  apiKey: "AIzaSyD7Qj3ls4V9FlqlfB-K3z_PnDl4Ao4Y7s8",
  authDomain: "freelancer-a4f3a.firebaseapp.com",
  databaseURL: "https://freelancer-a4f3a.firebaseio.com",
  projectId: "freelancer-a4f3a",
  storageBucket: "freelancer-a4f3a.appspot.com",
  messagingSenderId: "940005935320"
  };
let app = Firebase.initializeApp(config);
export const db = app.database();