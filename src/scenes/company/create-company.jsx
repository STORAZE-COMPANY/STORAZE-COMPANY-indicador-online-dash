import {
  Box,
  Button,
  TextField,
  useMediaQuery,
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
    checklistsControllerFindCheckListPaginatedByParams,
    checklistsControllerUpdateCompanyId,
  } = getIndicadorOnlineAPI();

  const [initialValues, setInitialValues] = useState({
    name: "",
    cnpj: "",
    email: "",
    isActive: true,
    checklists: [],
  });

  const [availableChecklists, setAvailableChecklists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allChecklists =
          await checklistsControllerFindCheckListPaginatedByParams({
            limit: "100",
            page: "1",
          });

          console.log("allChecklists", allChecklists)
        setAvailableChecklists(allChecklists);

        if (isEditing) {
          const companyRes = await companiesControllerFindOne(companyId);
          setInitialValues({
            name: companyRes.name,
            cnpj: companyRes.cnpj,
            email: companyRes.email,
            isActive: companyRes.isActive,
            checklists: [], 
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
      const { checklists, ...companyPayload } = values;
  
      const payload = {
        ...companyPayload,
        cnpj: companyPayload.cnpj.replace(/\D/g, ""),
      };
  
      let companyIdCreatedOrEdited = companyId;
  
      if (isEditing) {
        await companiesControllerUpdate({ ...payload, id: companyId });
        toast.success("Empresa atualizada com sucesso!");
      } else {
        const res = await companiesControllerCreate(payload);
        companyIdCreatedOrEdited = res.id;
        toast.success("Empresa criada com sucesso!");
        actions.resetForm();
      }
  
      if (checklists.length > 0 && companyIdCreatedOrEdited) {
        const { checklistsControllerConnectCheckListToCompany } = getIndicadorOnlineAPI();
  
        const connectPayload = checklists.map((checklistId) => ({
          companyId: companyIdCreatedOrEdited,
          checklistId,
        }));
  
        await checklistsControllerConnectCheckListToCompany(connectPayload);
      }
  
      setTimeout(() => {
        navigate("/company");
      }, 500);
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
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
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
                <InputLabel>Relacionar Checklists</InputLabel>
                <Select
                  name="checklists"
                  multiple
                  value={values.checklists || []}
                  onChange={(e) => setFieldValue("checklists", e.target.value)}
                  variant="filled"
                >
                  {availableChecklists.map((checklist) => (
                    <MenuItem key={checklist.id} value={checklist.id}>
                      {checklist.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
