import { useEffect, useRef } from "react";

/**
 * Her render'da güncellenen "en son değer" referansı.
 * Uzun ömürlü efektlerde (ör. realtime aboneliği) en güncel işlevi çağırmak için kullanılır;
 * işlev kimliği değiştiğinde efekti yeniden kurmaya (abonelikleri sökmeye) gerek kalmaz.
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
