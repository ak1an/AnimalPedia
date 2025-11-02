import { useEffect, useState } from "react";
import { onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";

export const useSafeQuery = (db: any, query: any) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(items);
      },
      (error: any) => console.error("Firestore onSnapshot error:", error)
    );

    return () => unsubscribe();
  }, [db, query]);

  return data;
};