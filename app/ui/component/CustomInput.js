import { Controller } from "react-hook-form";
const CustomInput = ({ label, control, placeholder, rules, name }) => (
  <>
    <Controller
      control={control}
      name={label}
      rules={rules}
      render={({ field: { ref, ...field } }) => (
        <input {...field} ref={ref} placeholder={placeholder} name={name} />
      )}
    />
  </>
);
export default CustomInput;
