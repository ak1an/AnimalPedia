import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

export const useSafeCollection = (db: any, collectionName: string) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const colRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      colRef,
      snapshot => setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
      error => console.error("Firestore onSnapshot error:", error)
    );

    return () => unsubscribe();
  }, [db, collectionName]);

  return data;
};