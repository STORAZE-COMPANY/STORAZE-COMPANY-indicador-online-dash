import { Header } from "../../components";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material"; 
import { useState } from "react";
import { tokens } from "../../theme";

const Checklist = () => {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const [checklistName, setChecklistName] = useState("");
  const [categories, setCategories] = useState([
    {
      categoryName: "",
      questions: [{ question: "", isRequired: false, isPhotoRequired: false }],
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
                sx={{ marginBottom: "20px", marginLeft: "20px" }}
              >
                <TextField
                  label={`Pergunta ${questionIndex + 1}`}
                  variant="outlined"
                  fullWidth
                  value={question.question}
                  onChange={(e) =>
                    handleChangeQuestion(
                      categoryIndex,
                      questionIndex,
                      "question",
                      e.target.value
                    )
                  }
                  sx={{ marginBottom: "10px" }}
                />
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
                  label="É obrigatório?"
                  sx={{ marginBottom: "10px", color: "#fff" }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={question.isPhotoRequired}
                      onChange={(e) =>
                        handleChangeQuestion(
                          categoryIndex,
                          questionIndex,
                          "isPhotoRequired",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="É necessário foto?"
                  sx={{ marginBottom: "10px", color: "#fff" }}
                />

                {/* Botão para excluir a pergunta */}
                <Button
                  variant="outlined"
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
