import { Box, TextField, } from "@mui/material";
import { PhoneInput } from "../phoneInput/phoneInput";


export function InputsSection({
  values,
  errors,
  touched,
  handleBlur,
  handleChange,

}) {


  return (
    <>
      <TextField
        fullWidth
        variant="filled"
        type="text"
        label="Nome Completo"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.name}
        name="name"
        error={touched.name && errors.name}
        helperText={touched.name && errors.name}
        sx={{
          gridColumn: "span 4",
        }}
      />

      <TextField
        fullWidth
        variant="filled"
        type="text"
        label="Email"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.email}
        name="email"
        error={touched.email && errors.email}
        helperText={touched.email && errors.email}
        sx={{ gridColumn: "span 4" }}
      />
      <PhoneInput
        handleBlur={handleBlur}
        handleChange={handleChange}
        values={values}
        touched={touched}
        errors={errors} />
    </>

  );
};


