import { useState } from 'react';

export interface Toast {
  id: number;
  kind: 'info' | 'success' | 'error';
  message: string;
}

// Simple toast stack (Week 1 polish). TODO: lift into a store so any component
// can push toasts (save confirmation, compile errors, alert notifications).
export default function Toasts() {
  const [toasts] = useState<Toast[]>([]);

  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.kind}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
