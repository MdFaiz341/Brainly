
import { forwardRef } from "react";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const inputDesign = "bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <input
          ref={ref}
          {...props}
          className={`${inputDesign} ${
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          } ${className}`}
        />
        
        {/* Render the error message if it exists */}
        {error && (
          <span className="text-xs text-red-400 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";