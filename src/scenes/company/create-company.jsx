import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import InputMask from "react-input-mask";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getIndicadorOnlineAPI } from "../../api/generated/api";

const initialValues = {
  name: "",
  cnpj: "",
  email: "",
  isActive: true,
  roleId: "",
};

const empresaSchema = yup.object().shape({
  name: yup.string().required("Campo obrigatório"),
  cnpj: yup.string().required("Campo obrigatório"),
  email: yup.string().email("Email inválido").required("Campo obrigatório"),
  roleId: yup.string().required("Nível de acesso obrigatório"),
});

const CreateCompany = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { companiesControllerCreate, rolesControllerFindList } =
    getIndicadorOnlineAPI();

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await rolesControllerFindList();
        setRoles(response);
      } catch (err) {
        toast.error("Erro ao carregar níveis de acesso");
        console.error(err);
      }
    };

    fetchRoles();
  }, []);

  const handleFormSubmit = async (values, actions) => {
    try {
      const payload = {
        ...values,
        cnpj: values.cnpj.replace(/\D/g, ""),
      };

      await companiesControllerCreate(payload);
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

              <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
                <InputLabel id="role-label" sx={{ color: "#999" }}>
                  Nível de Acesso
                </InputLabel>
                <Select
                  labelId="role-label"
                  name="roleId"
                  value={values.roleId}
                  onChange={(e) => setFieldValue("roleId", e.target.value)}
                  onBlur={handleBlur}
                  variant="filled"
                  sx={{ color: "#fff" }}
                  error={touched.roleId && !!errors.roleId}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.roleId && errors.roleId && (
                  <Typography color="error" fontSize={13}>
                    {errors.roleId}
                  </Typography>
                )}
              </FormControl>
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button type="submit" color="secondary" variant="contained">
                Criar Empresa
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
