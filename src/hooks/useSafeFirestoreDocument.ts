import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

export const useSafeDocument = (db: any, documentPath: string) => {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const docRef = doc(db, documentPath);
    const unsubscribe = onSnapshot(
      docRef,
      docSnapshot => {
        if (docSnapshot.exists()) {
          setData({ id: docSnapshot.id, ...docSnapshot.data() });
        } else {
          setData(null);
        }
      },
      error => console.error("Firestore onSnapshot error:", error)
    );

    return () => unsubscribe();
  }, [db, documentPath]);

  return data;
};