import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import InputMask from "react-input-mask";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getIndicadorOnlineAPI } from "../../api/generated/api";
import { useLocation, useNavigate } from "react-router-dom";

const empresaSchema = yup.object().shape({
  name: yup.string().required("Campo obrigatório"),
  cnpj: yup.string().required("Campo obrigatório"),
  email: yup.string().email("Email inválido").required("Campo obrigatório"),
});

const CreateCompany = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const companyId = location.state?.id || null;
  const isEditing = !!companyId;

  const {
    companiesControllerCreate,
    companiesControllerUpdate,
    companiesControllerFindOne,
  } = getIndicadorOnlineAPI();

  const [initialValues, setInitialValues] = useState({
    name: "",
    cnpj: "",
    email: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditing) {
          const companyRes = await companiesControllerFindOne(companyId);
          setInitialValues({
            name: companyRes.name,
            cnpj: companyRes.cnpj,
            email: companyRes.email,
            isActive: companyRes.isActive,
          });
        }
      } catch (err) {
        toast.error("Erro ao carregar dados");
        console.error(err);
      }
    };

    fetchData();
  }, [companyId]);

  const handleFormSubmit = async (values, actions) => {
    try {
      const payload = {
        ...values,
        cnpj: values.cnpj.replace(/\D/g, ""),
      };

      if (isEditing) {
        await companiesControllerUpdate({ ...payload, id: companyId });
        toast.success("Empresa atualizada com sucesso!");
      } else {
        await companiesControllerCreate(payload);
        toast.success("Empresa criada com sucesso!");
        actions.resetForm();
      }

      setTimeout(() => {
        navigate("/company");
      }, 500)
    } catch (err) {
      toast.error("Erro ao salvar empresa.");
      console.error(err);
    }
  };

  return (
    <Box m="20px">
      <Header
        title={isEditing ? "Editar Empresa" : "Criar Empresa"}
        subtitle={
          isEditing
            ? "Atualize as informações da empresa"
            : "Preencha as informações da empresa"
        }
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={empresaSchema}
        enableReinitialize
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
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />

              <InputMask
                mask="99.999.999/9999-99"
                value={values.cnpj}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                    variant="filled"
                    type="text"
                    label="CNPJ"
                    name="cnpj"
                    error={touched.cnpj && !!errors.cnpj}
                    helperText={touched.cnpj && errors.cnpj}
                    sx={{ gridColumn: "span 2" }}
                  />
                )}
              </InputMask>

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
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button type="submit" color="secondary" variant="contained">
                {isEditing ? "Atualizar Empresa" : "Criar Empresa"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  );
};

export default CreateCompany;