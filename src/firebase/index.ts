import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  update,
  push,
  remove,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBkEVokPydqVt1BhWdySkIAoQ4u6X6m140",
  authDomain: "chat-app-a0220.firebaseapp.com",
  databaseURL: "https://chat-app-a0220-default-rtdb.firebaseio.com",
  projectId: "chat-app-a0220",
  storageBucket: "chat-app-a0220.appspot.com",
  messagingSenderId: "1096381292862",
  appId: "1:1096381292862:web:022ba878f061d05a208c6f",
  measurementId: "G-2H7MM5XGV0",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const updateItem = (path: any, body: any) =>
  update(ref(database, path), body);
export const createItem = (path: any, body: any) =>
  push(ref(database, path), body);
export const removeItem = (path: any) => remove(ref(database, `${path}`));
export * from 'firebase/database';