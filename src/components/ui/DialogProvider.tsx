"use client";

/**
 * Tarayıcının alert()/confirm() pencerelerinin yerine geçen, çevirili ve erişilebilir iletişim bileşeni.
 *
 * Kullanım (istemci bileşeni içinde):
 *   const dialog = useDialog();
 *   dialog.alert(t("..."));                              // bildirim; beklenmesi gerekmez
 *   if (!(await dialog.confirm(t("..."), { danger: true }))) return;   // onay
 *
 * Aynı anda birden fazla çağrı gelirse sıraya alınır, sırayla gösterilir.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";

export type DialogOptions = {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  /** Yıkıcı işlemler (silme, bağlantı kesme) için onay düğmesi kırmızı olur. */
  danger?: boolean;
};

type DialogRequest = {
  id: number;
  kind: "alert" | "confirm";
  message: string;
  options: DialogOptions;
  resolve: (value: boolean) => void;
};

export type DialogApi = {
  alert: (message: unknown, options?: DialogOptions) => Promise<void>;
  confirm: (message: unknown, options?: DialogOptions) => Promise<boolean>;
};

// Sağlayıcı yoksa (ör. izole test) tarayıcı pencerelerine düşer; uygulama çökmez.
const fallbackApi: DialogApi = {
  alert: async (message) => {
    if (typeof window !== "undefined") window.alert(String(message ?? ""));
  },
  confirm: async (message) =>
    typeof window !== "undefined" ? window.confirm(String(message ?? "")) : false,
};

const DialogContext = createContext<DialogApi>(fallbackApi);

export function useDialog(): DialogApi {
  return useContext(DialogContext);
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("dialog");
  const [queue, setQueue] = useState<DialogRequest[]>([]);
  const nextId = useRef(1);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const enqueue = useCallback(
    (kind: DialogRequest["kind"], message: unknown, options: DialogOptions = {}) =>
      new Promise<boolean>((resolve) => {
        const id = nextId.current++;
        setQueue((q) => [...q, { id, kind, message: String(message ?? ""), options, resolve }]);
      }),
    []
  );

  const api = useMemo<DialogApi>(
    () => ({
      alert: async (message, options) => {
        await enqueue("alert", message, options);
      },
      confirm: (message, options) => enqueue("confirm", message, options),
    }),
    [enqueue]
  );

  const current = queue[0];

  const close = useCallback(
    (value: boolean) => {
      if (!current) return;
      current.resolve(value);
      setQueue((q) => q.slice(1));
    },
    [current]
  );

  useEffect(() => {
    if (!current) return;
    confirmButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(current.kind === "alert");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, close]);

  const isConfirm = current?.kind === "confirm";
  const confirmLabel = current?.options.confirmText ?? (isConfirm ? t("confirm") : t("ok"));
  const confirmClass = current?.options.danger
    ? "bg-red-600 hover:bg-red-700"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <DialogContext.Provider value={api}>
      {children}
      {current && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && isConfirm) close(false);
          }}
        >
          <div
            role={isConfirm ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby={current.options.title ? "app-dialog-title" : undefined}
            aria-describedby="app-dialog-message"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1E293B] p-6 text-white shadow-2xl"
          >
            {current.options.title && (
              <h2 id="app-dialog-title" className="mb-2 text-lg font-bold">
                {current.options.title}
              </h2>
            )}
            <p id="app-dialog-message" className="whitespace-pre-line break-words text-sm leading-relaxed text-gray-200">
              {current.message}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              {isConfirm && (
                <button
                  type="button"
                  onClick={() => close(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
                >
                  {current.options.cancelText ?? t("cancel")}
                </button>
              )}
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={() => close(true)}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${confirmClass}`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}
