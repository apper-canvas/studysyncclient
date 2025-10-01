import { useState } from "react";
import Label from "@/components/atoms/Label";

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#10b981", 
  "#f59e0b", "#ef4444", "#3b82f6", "#06b6d4",
  "#14b8a6", "#84cc16", "#f97316", "#6366f1"
];

const ColorPicker = ({ label, value, onChange, required }) => {
  return (
    <div className="space-y-2">
      <Label required={required}>{label}</Label>
      <div className="grid grid-cols-6 gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            style={{ 
              backgroundColor: color,
              border: value === color ? "3px solid #1e293b" : "2px solid transparent"
            }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;