import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import InputMask from "react-input-mask";
import { ToastContainer, toast } from "react-toastify";
import { getIndicadorOnlineAPI } from "../../api/generated/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; 

const employeeSchema = yup.object().shape({
  name: yup.string().required("Campo obrigatório"),
  email: yup.string().email("Email inválido").required("Campo obrigatório"),
  phone: yup.string().required("Campo obrigatório"),
  company_id: yup.string().required("Empresa obrigatória"),
  roleId: yup.string().required("Nível de acesso obrigatório"),
  selectedChecklists: yup.array().of(yup.string()),
});

const CreateEmployees = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dataAuth } = useAuth(); 
  const employee = location.state || null;
  const isEditing = !!employee;

  const {
    employeesControllerCreate,
    employeesControllerUpdate,
    employeesControllerFindList,
    rolesControllerFindList,
    companiesControllerFindAll,
    checklistsControllerFindCheckListPaginatedByParams,
    checklistsControllerConnectEmployeeToCheckList,
  } = getIndicadorOnlineAPI();

  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [checklists, setChecklists] = useState([]);

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    company_id: "",
    roleId: "",
    selectedChecklists: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, companiesRes, checklistsRes] = await Promise.all([
          rolesControllerFindList(),
          companiesControllerFindAll(),
          checklistsControllerFindCheckListPaginatedByParams({
            limit: "100",
            page: "1",
            byCompany: Number(dataAuth?.user?.company_id),
          }),
        ]);

        setRoles(rolesRes);
        setCompanies(companiesRes);
        setChecklists(checklistsRes);

        if (isEditing && employee?.id) {
          const allEmployees = await employeesControllerFindList({
            limit: "100",
            page: "1",
          });
          const current = allEmployees.find((e) => e.id === employee.id);
          const matchedRole = rolesRes.find(
            (r) => r.name === current?.role_name
          );

          if (current) {
            setFormValues({
              name: current.name || "",
              email: current.email || "",
              phone: current.phone || "",
              company_id: String(current.company_id || ""),
              roleId: matchedRole?.id || "",
              selectedChecklists: [],
            });
          }
        }
      } catch (err) {
        toast.error("Erro ao carregar dados");
        console.error(err);
      }
    };

    fetchData();
  }, [isEditing, employee, dataAuth]);

  const handleFormSubmit = async (values, actions) => {
    try {
      let employeeId = null;
  
      if (isEditing) {
        const payloadUpdate = {
          id: employee.id,
          name: values.name,
          email: values.email,
          phone: values.phone.replace(/\D/g, ""),
          company_id: Number(values.company_id),
          role_id: values.roleId, 
        };
  
        await employeesControllerUpdate(payloadUpdate);
        employeeId = employee.id;
        toast.success("Funcionário atualizado com sucesso!");
      } else {
        const payloadCreate = {
          name: values.name,
          email: values.email,
          phone: values.phone.replace(/\D/g, ""),
          company_id: Number(values.company_id),
          roleId: values.roleId, 
        };
  
        const res = await employeesControllerCreate(payloadCreate);
        employeeId = res.id;
        toast.success("Funcionário criado com sucesso!");
        actions.resetForm();
      }
  
      if (values.selectedChecklists.length > 0 && employeeId) {
        for (const checklistId of values.selectedChecklists) {
          await checklistsControllerConnectEmployeeToCheckList({
            checklistId,
            employee_id: employeeId,
          });
        }
      }
  
      setTimeout(() => navigate("/employees"), 1000);
    } catch (err) {
      toast.error("Erro ao salvar funcionário.");
      console.error(err);
    }
  };

  return (
    <Box m="20px">
      <Header
        title={isEditing ? "Atualizar Funcionário" : "Criar Funcionário"}
        subtitle={
          isEditing
            ? "Altere as informações do funcionário"
            : "Preencha as informações do funcionário"
        }
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={formValues}
        validationSchema={employeeSchema}
        enableReinitialize
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
            >
              <TextField
                fullWidth
                variant="filled"
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
                    label="Telefone"
                    name="phone"
                    error={touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    sx={{ gridColumn: "span 2" }}
                  />
                )}
              </InputMask>

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel id="company-label">Empresa</InputLabel>
                <Select
                  labelId="company-label"
                  name="company_id"
                  value={values.company_id}
                  onChange={(e) => setFieldValue("company_id", e.target.value)}
                  onBlur={handleBlur}
                  variant="filled"
                  error={touched.company_id && !!errors.company_id}
                >
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel id="role-label">Nível de Acesso</InputLabel>
                <Select
                  labelId="role-label"
                  name="roleId"
                  value={values.roleId}
                  onChange={(e) => setFieldValue("roleId", e.target.value)}
                  onBlur={handleBlur}
                  variant="filled"
                  error={touched.roleId && !!errors.roleId}
                >
                  {roles.map((role) => {
                    const roleDisplayName =
                      {
                        superAdmin: "Administrador do sistema",
                        admin: "Gestor",
                        user: "Usuário",
                      }[role.name] || role.name;

                    return (
                      <MenuItem key={role.id} value={role.id}>
                        {roleDisplayName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
                <InputLabel id="checklists-label">
                  Checklists Permitidos
                </InputLabel>
                <Select
                  labelId="checklists-label"
                  multiple
                  name="selectedChecklists"
                  value={values.selectedChecklists}
                  onChange={(e) =>
                    setFieldValue("selectedChecklists", e.target.value)
                  }
                  variant="filled"
                >
                  {checklists.map((cl) => (
                    <MenuItem key={cl.id} value={cl.id}>
                      {cl.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button type="submit" color="secondary" variant="contained">
                {isEditing ? "Atualizar Funcionário" : "Criar Funcionário"}
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
