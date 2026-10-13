import { useEffect, useRef, useState, type FormEvent } from "react";
import type { User } from "../types";

interface Props {
  mode: "submit" | "login";
  initial: User | null;
  onCancel: () => void;
  onSave: (user: User) => void;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EntryModal({ mode, initial, onCancel, onSave }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [touched, setTouched] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const nameOk = name.trim().length > 0;
  const emailOk = EMAIL.test(email.trim());

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (nameOk && emailOk) onSave({ name: name.trim(), email: email.trim() });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">{mode === "submit" ? "Enter your details" : "Log in"}</h2>
        <p className="modal-copy">
          {mode === "submit"
            ? "We need your name and email to record your predictions and leaderboard entry."
            : "Enter the name and email you used to enter."}
        </p>
        <form onSubmit={submit} noValidate>
          <label>
            Name
            <input ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={touched && !nameOk} />
            {touched && !nameOk && <span className="field-error">Enter your name</span>}
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={touched && !emailOk} />
            {touched && !emailOk && <span className="field-error">Enter a valid email address</span>}
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-quiet" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {mode === "submit" ? "Submit entry →" : "Log in"}
            </button>
          </div>
        </form>
        <p className="fine">We only use your email to contact you about prizes · 18+ free to play</p>
      </div>
    </div>
  );
}
