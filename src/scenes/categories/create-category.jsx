import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { getIndicadorOnlineAPI } from "../../api/generated/api";

const initialValues = {
  name: "",
};

const categorySchema = yup.object().shape({
  name: yup.string().required("Nome da categoria é obrigatório"),
});

const CreateCategory = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { categoriesControllerCreate } = getIndicadorOnlineAPI();

  const handleFormSubmit = async (values, actions) => {
    try {
      await categoriesControllerCreate(values);
      toast.success("Categoria criada com sucesso!");
      actions.resetForm({ values: initialValues });

      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (err) {
      toast.error("Erro ao criar categoria.");
      console.error(err);
    }
  };

  return (
    <Box m="20px">
      <Header
        title="Criar Categoria"
        subtitle="Preencha o nome da nova categoria"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={categorySchema}
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
          >
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Nome da Categoria"
              name="name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              sx={{ gridColumn: "span 4" }}
            />
        
            <Box gridColumn="span 4" display="flex" justifyContent="flex-end">
              <Button type="submit" color="secondary" variant="contained">
                Criar Categoria
              </Button>
            </Box>
          </Box>
        </form>
        )}
      </Formik>

      <ToastContainer />
    </Box>
  );
};

export default CreateCategory;
