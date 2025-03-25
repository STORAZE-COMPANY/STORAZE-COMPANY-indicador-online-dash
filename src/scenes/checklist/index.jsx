import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  Divider,
  Grid,
  Radio,
  Paper,
} from "@mui/material";
import { AddCircleOutline, Delete, CloseOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChecklistForm = () => {
  const [checklistName, setChecklistName] = useState("");
  const [categories, setCategories] = useState([
    {
      categoryName: "",
      questions: [
        {
          questionText: "",
          questionType: "Texto",
          options: [],
          isRequired: true,
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
          {
            questionText: "",
            questionType: "Texto",
            options: [],
            isRequired: false,
            position: 1,
          },
        ],
      },
    ]);
  };

  const handleAddQuestion = (index) => {
    const newCategories = [...categories];
    newCategories[index].questions.push({
      questionText: "",
      questionType: "Texto",
      options: [],
      isRequired: false,
      position: newCategories[index].questions.length + 1,
    });
    setCategories(newCategories);
  };

  const handleAddOption = (catIdx, qIdx) => {
    const newCategories = [...categories];
    newCategories[catIdx].questions[qIdx].options.push("");
    setCategories(newCategories);
  };

  const handleDeleteOption = (catIdx, qIdx, optIdx) => {
    const newCategories = [...categories];
    newCategories[catIdx].questions[qIdx].options.splice(optIdx, 1);
    setCategories(newCategories);
  };

  const handleChangeQuestion = (catIdx, qIdx, field, value) => {
    const newCategories = [...categories];

    if (field === "position") {
      const newPosition = parseInt(value);
      const currentQuestions = newCategories[catIdx].questions;
      const isDuplicate = currentQuestions.some(
        (q, index) => index !== qIdx && q.position === newPosition
      );

      if (isDuplicate) {
        toast.error("Essa posição já está em uso na categoria.");
        return;
      }

      newCategories[catIdx].questions[qIdx][field] = newPosition;
    } else {
      newCategories[catIdx].questions[qIdx][field] = value;
    }

    setCategories(newCategories);
  };

  const handleSubmit = () => {
    console.log({ checklistName, categories });
  };

  return (
    <Box p={4} bgcolor="#141B2D" color="#fff">
      <Paper
        elevation={3}
        sx={{ backgroundColor: "#434957", p: 3, borderRadius: 3, mb: 4 }}
      >
        <Typography variant="h5" gutterBottom>
          Criar Checklist
        </Typography>
        <Divider sx={{ borderColor: "#7ec8f2", mb: 2 }} />
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Nome do Checklist
        </Typography>
        <TextField
          fullWidth
          placeholder="Digite o nome do Checklist"
          variant="outlined"
          value={checklistName}
          onChange={(e) => setChecklistName(e.target.value)}
          sx={{ mb: 2, backgroundColor: "#3b4050", input: { color: "#fff" } }}
        />
      </Paper>

      {categories.map((cat, catIdx) => (
        <Paper
          key={catIdx}
          elevation={3}
          sx={{
            mb: 4,
            p: 2,
            bgcolor: "#434957",
            borderRadius: 3,
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -16,
              left: 16,
              backgroundColor: "#7ec8f2",
              px: 2,
              py: 0.5,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Categoria {catIdx + 1}/{categories.length}
          </Box>

          <TextField
            fullWidth
            placeholder="Digite o nome da categoria"
            value={cat.categoryName}
            onChange={(e) => {
              const newCategories = [...categories];
              newCategories[catIdx].categoryName = e.target.value;
              setCategories(newCategories);
            }}
            sx={{ mb: 3, backgroundColor: "#3b4050", input: { color: "#fff" } }}
          />

          {cat.questions.map((q, qIdx) => (
            <Box key={qIdx} mb={3} p={2} bgcolor="#6E7484" borderRadius={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    placeholder="Digite a pergunta"
                    value={q.questionText}
                    onChange={(e) =>
                      handleChangeQuestion(
                        catIdx,
                        qIdx,
                        "questionText",
                        e.target.value
                      )
                    }
                    sx={{
                      backgroundColor: "#6E7484",
                      input: { color: "#fff" },
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Posição"
                    value={q.position}
                    onChange={(e) =>
                      handleChangeQuestion(
                        catIdx,
                        qIdx,
                        "position",
                        e.target.value
                      )
                    }
                    sx={{
                      backgroundColor: "#6E7484",
                      input: { color: "#fff" },
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "#fff" }}>
                      Tipo de Pergunta
                    </InputLabel>
                    <Select
                      value={q.questionType}
                      onChange={(e) =>
                        handleChangeQuestion(
                          catIdx,
                          qIdx,
                          "questionType",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "#6E7484", color: "#fff" }}
                    >
                      <MenuItem value="Múltipla escolha">
                        Múltipla escolha
                      </MenuItem>
                      <MenuItem value="Texto">Texto</MenuItem>
                      <MenuItem value="Upload de arquivo">
                        Upload de arquivo
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Obrigatória:
                  </Typography>
                  <Switch
                    checked={q.isRequired}
                    onChange={(e) =>
                      handleChangeQuestion(
                        catIdx,
                        qIdx,
                        "isRequired",
                        e.target.checked
                      )
                    }
                  />
                </Grid>
              </Grid>

              {q.questionType === "Múltipla escolha" && (
                <Box mt={2}>
                  {q.options.map((opt, optIdx) => (
                    <Box
                      key={optIdx}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      mb={1}
                    >
                      <Radio disabled />
                      <TextField
                        value={opt}
                        placeholder={`Opção ${optIdx + 1}`}
                        onChange={(e) => {
                          const newCategories = [...categories];
                          newCategories[catIdx].questions[qIdx].options[
                            optIdx
                          ] = e.target.value;
                          setCategories(newCategories);
                        }}
                        sx={{
                          flex: 1,
                          backgroundColor: "#6E7484",
                          input: { color: "#fff" },
                        }}
                      />
                      <IconButton
                        onClick={() => handleDeleteOption(catIdx, qIdx, optIdx)}
                      >
                        <CloseOutlined sx={{ color: "white" }} />
                      </IconButton>
                    </Box>
                  ))}
                  <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<AddCircleOutline />}
                      onClick={() => handleAddOption(catIdx, qIdx)}
                      sx={{ color: "white" }}
                    >
                      Adicionar opção
                    </Button>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => {
                          const newCategories = [...categories];
                          newCategories[catIdx].questions.splice(qIdx, 1);
                          setCategories(newCategories);
                        }}
                      >
                        Excluir pergunta
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {q.questionType === "Texto" && (
                <Box mt={2}>
                  <TextField
                    fullWidth
                    disabled
                    value="Resposta em texto"
                    sx={{
                      backgroundColor: "#6E7484",
                      input: { color: "#fff" },
                    }}
                  />

                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => {
                        const newCategories = [...categories];
                        newCategories[catIdx].questions.splice(qIdx, 1);
                        setCategories(newCategories);
                      }}
                    >
                      Excluir pergunta
                    </Button>
                  </Box>
                </Box>
              )}

              {q.questionType === "Upload de arquivo" && (
                <Box mt={2}>
                  <TextField
                    fullWidth
                    disabled
                    value="Upload de arquivo habilitado"
                    sx={{
                      backgroundColor: "#3b4050",
                      input: { color: "#fff" },
                    }}
                  />
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => {
                        const newCategories = [...categories];
                        newCategories[catIdx].questions.splice(qIdx, 1);
                        setCategories(newCategories);
                      }}
                    >
                      Excluir pergunta
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          ))}

          <Divider sx={{ my: 2, backgroundColor: "#7ec8f2" }} />

          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={() => handleAddQuestion(catIdx)}
              sx={{ color: "white", backgroundColor: "#6E7484" }}
            >
              Adicionar pergunta
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => {
                const newCategories = categories.filter((_, i) => i !== catIdx);
                setCategories(newCategories);
              }}
            >
              Excluir Categoria
            </Button>
          </Box>
        </Paper>
      ))}

      <Button
        variant="contained"
        color="warning"
        startIcon={<AddCircleOutline />}
        onClick={handleAddCategory}
        sx={{ mr: 2, color: "white" }}
      >
        Adicionar Categoria
      </Button>

      <Button
        variant="contained"
        color="success"
        onClick={handleSubmit}
        fullWidth
        sx={{
          mt: 2,
          height: "50px",
          color: "primary",
          fontWeight: "bold",
          fontSize: 14,
          backgroundColor: "#7ec8f2",
          "&:hover": {
            backgroundColor: "#1499e6",
          },
        }}
      >
        Publicar checklist
      </Button>

      <ToastContainer />
    </Box>
  );
};

export default ChecklistForm;
