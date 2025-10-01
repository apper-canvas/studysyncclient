import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  id, 
  error, 
  required,
  type = "text",
  ...inputProps 
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Input 
        id={id} 
        type={type}
        error={error}
        aria-invalid={error ? "true" : "false"}
        {...inputProps} 
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;