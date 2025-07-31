/* eslint-disable @typescript-eslint/no-empty-object-type */
// components/Input.tsx
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="border rounded px-3 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    />
  );
}
