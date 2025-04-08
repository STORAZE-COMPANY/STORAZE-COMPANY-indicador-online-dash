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
  email: "",
  phone: "",
  company_id: "",
  roleId: "",
};

const employeeSchema = yup.object().shape({
  name: yup.string().required("Campo obrigatório"),
  email: yup.string().email("Email inválido").required("Campo obrigatório"),
  phone: yup.string().required("Campo obrigatório"),
  company_id: yup.string().required("Empresa obrigatória"),
  roleId: yup.string().required("Nível de acesso obrigatório"),
});

const CreateEmployees = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { employeesControllerCreate, rolesControllerFindList, companiesControllerFindAll } =
    getIndicadorOnlineAPI();

  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, companiesRes] = await Promise.all([
          rolesControllerFindList(),
          companiesControllerFindAll(),
        ]);
        setRoles(rolesRes);
        setCompanies(companiesRes);
      } catch (err) {
        toast.error("Erro ao carregar dados");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (values, actions) => {
    try {
      const payload = {
        ...values,
        phone: values.phone.replace(/\D/g, ""),
        company_id: Number(values.company_id),
      };

      await employeesControllerCreate(payload);
      toast.success("Funcionário criado com sucesso!");
      actions.resetForm({ values: initialValues });
    } catch (err) {
      toast.error("Erro ao criar funcionário.");
      console.error(err);
    }
  };

  return (
    <Box m="20px">
      <Header
        title="Criar Funcionário"
        subtitle="Preencha as informações do funcionário"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={employeeSchema}
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
                label="Nome"
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

              <InputMask
                mask="(99) 99999-9999"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Telefone"
                    name="phone"
                    error={touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    sx={{ gridColumn: "span 2" }}
                  />
                )}
              </InputMask>

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel id="company-label" sx={{ color: "#999" }}>
                  Empresa
                </InputLabel>
                <Select
                  labelId="company-label"
                  name="company_id"
                  value={values.company_id}
                  onChange={(e) => setFieldValue("company_id", e.target.value)}
                  onBlur={handleBlur}
                  variant="filled"
                  sx={{ color: "#fff" }}
                  error={touched.company_id && !!errors.company_id}
                >
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.company_id && errors.company_id && (
                  <Typography color="error" fontSize={13}>
                    {errors.company_id}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
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
                Criar Funcionário
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  );
};

export default CreateEmployees;