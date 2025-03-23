import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";

const initialValues = {
  nomeEmpresa: "",
  cidade: "",
  contacto: "",
  email: "",
  endereco: "",
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const empresaSchema = yup.object().shape({
  nomeEmpresa: yup.string().required("Campo obrigatório"),
  cidade: yup.string().required("Campo obrigatório"),
  contacto: yup
    .string()
    .matches(phoneRegExp, "Número inválido")
    .required("Campo obrigatório"),
  email: yup.string().email("Email inválido").required("Campo obrigatório"),
  endereco: yup.string().required("Campo obrigatório"),
});

const CreateCompany = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values, actions) => {
    console.log(values);
    actions.resetForm({
      values: initialValues,
    });
  };

  return (
    <Box m="20px">
      <Header
        title="Criar Empresa"
        subtitle="Preencha as informações da empresa"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={empresaSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nome da Empresa"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nomeEmpresa}
                name="nomeEmpresa"
                error={touched.nomeEmpresa && !!errors.nomeEmpresa}
                helperText={touched.nomeEmpresa && errors.nomeEmpresa}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cidade"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cidade}
                name="cidade"
                error={touched.cidade && !!errors.cidade}
                helperText={touched.cidade && errors.cidade}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contato"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contacto}
                name="Contato"
                error={touched.contacto && !!errors.contacto}
                helperText={touched.contacto && errors.contacto}
                sx={{ gridColumn: "span 2" }}
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
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Endereço"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.endereco}
                name="endereco"
                error={touched.endereco && !!errors.endereco}
                helperText={touched.endereco && errors.endereco}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="end"
              mt="20px"
            >
              <Button type="submit" color="secondary" variant="contained">
                Criar Empresa
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateCompany;
