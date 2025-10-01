import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";

const SelectField = ({ 
  label, 
  id, 
  error,
  required,
  children,
  ...selectProps 
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Select 
        id={id}
        error={error}
        aria-invalid={error ? "true" : "false"}
        {...selectProps}
      >
        {children}
      </Select>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default SelectField;