import React from "react";
import InputMask from "react-input-mask";
import { TextField } from "@mui/material";

export const PhoneInput = ({ handleBlur, handleChange, values, touched, errors }) => {
  return (
    <InputMask
      mask="(99) 99999-9999"
      value={values.contact}
      onChange={handleChange}
      onBlur={handleBlur}
    >
      {() => (
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Telefone"
          name="contact"
          error={touched.contact && Boolean(errors.contact)}
          helperText={touched.contact && errors.contact}
          sx={{ gridColumn: "span 4" }}
        />
      )}
    </InputMask>
  );
};

