import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

// mock de checklists
const MOCKED_CHECKLISTS = [
  { id: 1, name: "Checklist de Segurança" },
  { id: 2, name: "Checklist de Limpeza" },
  { id: 3, name: "Checklist de TI" },
];

const initialValues = {
  name: "",
  cnpj: "",
  email: "",
  address: "",
  contact: "",
  isActive: true,
  checklistIds: [],
};

const empresaSchema = yup.object().shape({
  name: yup.string().required("Campo obrigatório"),
  cnpj: yup.string().required("Campo obrigatório"),
  contact: yup.string().required("Campo obrigatório"),
  email: yup.string().email("Email inválido").required("Campo obrigatório"),
  address: yup.string().required("Campo obrigatório"),
  checklistIds: yup.array().min(1, "Selecione ao menos um checklist"),
});

const CreateCompany = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, actions) => {
    try {
      await api.post("/companies", values);
      toast.success("Empresa criada com sucesso!");
      actions.resetForm({ values: initialValues });
    } catch (err) {
      toast.error("Erro ao criar empresa.");
      console.error(err);
    }
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
          setFieldValue,
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
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="CNPJ"
                name="cnpj"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cnpj}
                error={touched.cnpj && !!errors.cnpj}
                helperText={touched.cnpj && errors.cnpj}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contato"
                name="contact"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                error={touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Endereço"
                name="address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                error={touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            {/* Checklist Selection */}
            <Box mt={4}>
              <Typography variant="h6" color="#7ec8f2" mb={1}>
                Selecionar Checklists
              </Typography>

              {MOCKED_CHECKLISTS.map((item) => (
                <FormControlLabel
                key={item.id}
                control={
                  <Checkbox
                    checked={values.checklistIds.includes(item.id)}
                    onChange={(e) => {
                      const selected = values.checklistIds;
                      if (e.target.checked) {
                        setFieldValue("checklistIds", [...selected, item.id]);
                      } else {
                        setFieldValue(
                          "checklistIds",
                          selected.filter((id) => id !== item.id)
                        );
                      }
                    }}
                    sx={{
                      color: "#aaa", // cor quando desmarcado
                      '&.Mui-checked': {
                        color: "#7ec8f2", // cor quando marcado
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: "#fff" }}>
                    {item.name}
                  </Typography>
                }
              />
              
              ))}

              {touched.checklistIds && errors.checklistIds && (
                <Typography color="error" fontSize={14}>
                  {errors.checklistIds}
                </Typography>
              )}
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={4}>
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
