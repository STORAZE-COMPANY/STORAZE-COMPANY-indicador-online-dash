import { Box, Button, TextField, useMediaQuery, InputLabel } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import React, { useState, useEffect } from 'react';
import { getCompanies } from "./requests";
import { useCreateEmployeeForm } from "./form";
import { PhoneInput } from "./phoneInput/phoneInput";
import { toast, ToastContainer } from "react-toastify";
import { SelectCompanySection } from "./select_company_section";
import { InputsSection } from "./inputsSection";
export function CreateEmployee() {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState('');

  const { initialValues, checkoutSchema, handleFormSubmit } = useCreateEmployeeForm();

  function handleSubmit(values, actions) {
    handleFormSubmit(values, actions,
      (responseMessages) => toast.error(responseMessages),
      (responseMessages) => toast.success(responseMessages)).then(() => setCompanyId(''))
  }

  useEffect(() => {
    getCompanies().then((response) => {
      setCompanies(response);
    });
  }, []);

  return (
    <Box m="20px">
      <Header title="Criar Usuário" subtitle="Criar novo usuário" />
      <Formik
        onSubmit={(values, actions) => handleSubmit(values, actions)}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
          isValid
        }) => (
          <Box>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                },
              }}
            >
              <InputsSection
                errors={errors}
                handleBlur={handleBlur}
                handleChange={handleChange}
                touched={touched}
                values={values}
              />
              <SelectCompanySection
                companies={companies}
                companyId={companyId}
                onChange={(event) => {
                  setCompanyId(event.target.value),
                    setFieldValue("company_id", Number(event.target.value))
                }}
              />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="end"
              mt="20px"
            >
              <Button disabled={isSubmitting || !isValid} onClick={handleSubmit} color="secondary" variant="contained">
                Criar
              </Button>
            </Box>
          </Box>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  );
};


