import { useState } from "react";

import { Header } from "../../components";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Divider,
  useTheme,
  Grid,
} from "@mui/material";

import { tokens } from "../../theme";

const Checklist = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [checklistName, setChecklistName] = useState("");
  const [categories, setCategories] = useState([
    {
      categoryName: "",
      questions: [
        {
          questionText: "",
          questionType: "", // "Foto", "SIM e NÃO" ou "Texto"
          isRequired: false,
          isRequiredPhoto: false,
          position: 1,
        },
      ],
    },
  ]);

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      {
        categoryName: "",
        questions: [
          { question: "", isRequired: false, isPhotoRequired: false },
        ],
      },
    ]);
  };

  const handleAddQuestionToCategory = (categoryIndex) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].questions.push({
      question: "",
      isRequired: false,
      isPhotoRequired: false,
      position: newCategories[categoryIndex].questions.length + 1,
    });
    setCategories(newCategories);
  };

  const handleChangeCategory = (categoryIndex, field, value) => {
    const newCategories = [...categories];
    newCategories[categoryIndex][field] = value;
    setCategories(newCategories);
  };

  const handleChangeQuestion = (categoryIndex, questionIndex, field, value) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].questions[questionIndex][field] = value;
    setCategories(newCategories);
  };

  const handleDeleteCategory = (categoryIndex) => {
    const newCategories = categories.filter(
      (_, index) => index !== categoryIndex
    );
    setCategories(newCategories);
  };

  const handleDeleteQuestion = (categoryIndex, questionIndex) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].questions = newCategories[
      categoryIndex
    ].questions.filter((_, index) => index !== questionIndex);
    setCategories(newCategories);
  };

  const handleSubmit = () => {
    console.log("Checklist Name:", checklistName);
    console.log("Categories:", categories);
  };

  return (
    <Box m="20px">
      <Header title="Checklist" subtitle="Crie seu Checklist" />
      <Box
        sx={{
          backgroundColor: "#434957",
          color: "#fff",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {checklistName ? checklistName : "Criar Checklist"}
        </Typography>
        {/* Campo para nome do checklist */}
        <TextField
          label="Nome do Checklist"
          variant="outlined"
          fullWidth
          value={checklistName}
          onChange={(e) => setChecklistName(e.target.value)}
          sx={{ marginBottom: "20px" }}
        />

        <Divider
          sx={{
            marginBottom: "20px",
            marginTop: "20px",
            borderColor: colors.greenAccent[400],
          }}
        />
        {/* Categorias do checklist */}
        {categories.map((category, categoryIndex) => (
          <Box key={categoryIndex} sx={{ marginBottom: "30px" }}>
            {/* Botão para excluir a categoria */}
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => handleDeleteCategory(categoryIndex)}
              sx={{ marginBottom: "20px" }}
            >
              Excluir Categoria
            </Button>
            <Typography variant="h6" gutterBottom>
              {category.categoryName || `Categoria ${categoryIndex + 1}`}:
              <TextField
                label="Nome da Categoria"
                variant="outlined"
                value={category.categoryName}
                onChange={(e) =>
                  handleChangeCategory(
                    categoryIndex,
                    "categoryName",
                    e.target.value
                  )
                }
                sx={{
                  marginBottom: "20px",
                  marginTop: "10px",
                  width: "100%",
                }}
              />
            </Typography>

            {/* Perguntas da categoria */}
            {category.questions.map((question, questionIndex) => (
              <Box
                key={questionIndex}
                sx={{
                  marginBottom: "20px",
                  marginLeft: "20px",
                  backgroundColor: "#6F7484",
                  padding: "20px",
                  borderRadius: 2,
                }}
              >
                <TextField
                  label={`Pergunta ${questionIndex + 1}`}
                  variant="outlined"
                  fullWidth
                  value={question.questionText}
                  onChange={(e) =>
                    handleChangeQuestion(
                      categoryIndex,
                      questionIndex,
                      "questionText",
                      e.target.value
                    )
                  }
                />
                {/* Grid para as duas seções lado a lado */}
                <Grid container spacing={2} marginTop={3} marginBottom={3}>
                  <Grid item xs={4}>
                    {/* Tipo de pergunta */}
                    <Typography variant="h6" gutterBottom>
                      Tipo de pergunta:
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={question.questionType === "Foto"}
                          onChange={() =>
                            handleChangeQuestion(
                              categoryIndex,
                              questionIndex,
                              "questionType",
                              "Foto"
                            )
                          }
                        />
                      }
                      label="Foto"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={question.questionType === "SIM e NÃO"}
                          onChange={() =>
                            handleChangeQuestion(
                              categoryIndex,
                              questionIndex,
                              "questionType",
                              "SIM e NÃO"
                            )
                          }
                        />
                      }
                      label="Sim e Não"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={question.questionType === "Texto"}
                          onChange={() =>
                            handleChangeQuestion(
                              categoryIndex,
                              questionIndex,
                              "questionType",
                              "Texto"
                            )
                          }
                        />
                      }
                      label="Texto"
                    />
                  </Grid>

                  <Grid item xs={4}>
                    {/* Obrigatoriedade */}
                    <Typography variant="h6" gutterBottom>
                      Obrigatoriedade:
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={question.isRequired}
                          onChange={(e) =>
                            handleChangeQuestion(
                              categoryIndex,
                              questionIndex,
                              "isRequired",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Obrigatório responder"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={question.isRequiredPhoto}
                          onChange={(e) =>
                            handleChangeQuestion(
                              categoryIndex,
                              questionIndex,
                              "isRequiredPhoto",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Foto obrigatória"
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="h6" gutterBottom>
                      Posição da pergunta:
                    </Typography>
                    <TextField
                      type="number"
                      label="Posição"
                      variant="outlined"
                      value={question.position}
                      InputProps={{ inputProps: { min: 1 } }}
                      onChange={(e) => {
                        const posValue = Math.max(
                          1,
                          parseInt(e.target.value) || 1
                        );
                        handleChangeQuestion(
                          categoryIndex,
                          questionIndex,
                          "position",
                          posValue
                        );
                      }}
                      sx={{ marginBottom: "10px" }}
                    />
                  </Grid>
                </Grid>

                {/* Botão para excluir a pergunta */}
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() =>
                    handleDeleteQuestion(categoryIndex, questionIndex)
                  }
                >
                  Excluir Pergunta
                </Button>
              </Box>
            ))}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutline />}
              onClick={() => handleAddQuestionToCategory(categoryIndex)}
              sx={{ marginBottom: "20px" }}
            >
              Adicionar Pergunta
            </Button>
            <Divider
              sx={{
                marginBottom: "20px",
                marginTop: "20px",
                borderColor: "#808080",
              }}
            />
          </Box>
        ))}

        {/* Botão para adicionar novas categorias */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
          onClick={handleAddCategory}
          sx={{ marginBottom: "20px" }}
        >
          Adicionar Categoria
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddCircleOutline />}
          onClick={handleSubmit}
          sx={{ marginBottom: "20px", marginLeft: "20px" }}
        >
          Criar Checklist
        </Button>
      </Box>
    </Box>
  );
};

export default Checklist;
