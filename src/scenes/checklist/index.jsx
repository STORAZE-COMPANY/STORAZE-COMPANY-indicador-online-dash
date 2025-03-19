import { Header } from "../../components";

import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { useState } from "react";

const Checklist = () => {
  const [checklistName, setChecklistName] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", isRequired: false, isPhotoRequired: false },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", isRequired: false, isPhotoRequired: false },
    ]);
  };

  const handleChangeQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    console.log("Checklist Name:", checklistName);
    console.log("Questions:", questions);
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
          Criar Checklist
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
        {/* Perguntas do checklist */}
        {questions.map((question, index) => (
          <Box key={index} sx={{ marginBottom: "20px" }}>
            <TextField
              label={`Pergunta ${index + 1}`}
              variant="outlined"
              fullWidth
              value={question.question}
              onChange={(e) =>
                handleChangeQuestion(index, "question", e.target.value)
              }
              sx={{ marginBottom: "10px" }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={question.isRequired}
                  onChange={(e) =>
                    handleChangeQuestion(index, "isRequired", e.target.checked)
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
                      index,
                      "isPhotoRequired",
                      e.target.checked
                    )
                  }
                />
              }
              label="É necessário foto?"
              sx={{ marginBottom: "10px", color: "#fff" }}
            />
          </Box>
        ))}

        {/* Botão para adicionar novas perguntas */}
        <Button
          variant="contained"
          color="success"
          startIcon={<AddCircleOutline />}
          onClick={handleAddQuestion}
          sx={{ marginBottom: "20px" }}
        >
          Adicionar Pergunta
        </Button>
        <Button
          variant="contained"
          color="primary"
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
