
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  onClick?: ()=>void;
  type? : "submit"
  disabled?:boolean
  size: "lg" | "sm"
}


export const primaryDesign = "bg-purple-600 text-white hover:scale-105 transition-all duration-200 font-semibold cursor-pointer rounded-xl"
export const secondaryDesign = " text-white rounded-xl border border-white/30 hover:bg-white/10 transition cursor-pointer"

export const primaryBigdesign = "px-6 py-3"
export const secondaryBigdesign = "px-8 py-3 text-lg"
export const smallNormaldesign = "px-5 py-2"


export const Button = ({ children, className, variant, onClick, size, type, disabled}: ButtonProps) => {
  return (
    <button type={type} disabled={disabled} className={`${className}
      ${variant === "primary" ? `${primaryDesign}` : `${secondaryDesign}`}
      ${size === "lg" ? variant === "primary" ? `${primaryBigdesign}` : `${secondaryBigdesign}` : `${smallNormaldesign}`}
      `} onClick={onClick}>
      
      {children}
    </button>
  );
};
