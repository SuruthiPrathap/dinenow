import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const makeNumber = (prefix) => prefix + "-" + Date.now().toString().slice(-6);

export async function saveOrder(order) {
  const number = makeNumber("DN");
  const ref = await addDoc(collection(db, "orders"), {
    ...order,
    number,
    status: "New",
    placedAt: Date.now(),
    createdAt: serverTimestamp()
  });
  return { id: ref.id, number };
}

export async function saveBooking(booking) {
  const number = makeNumber("BK");
  await addDoc(collection(db, "bookings"), {
    ...booking,
    number,
    status: "New",
    createdAt: serverTimestamp()
  });
  return number;
}