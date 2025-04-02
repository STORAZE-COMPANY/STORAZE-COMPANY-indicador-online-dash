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
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { AddCircleOutline, Delete, CloseOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/axios";

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
          promptIA: "",
          id: Date.now() + Math.random(),
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
            promptIA: "",
            id: Date.now() + Math.random(),
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
      promptIA: "",
      id: Date.now() + Math.random(),
    });
    setCategories(newCategories);
  };

  const handleAddOption = (catIdx, qIdx) => {
    const newCategories = [...categories];
    newCategories[catIdx].questions[qIdx].options.push({
      value: "",
      isAnomaly: false,
    });
    setCategories(newCategories);
  };

  const handleDeleteOption = (catIdx, qIdx, optIdx) => {
    const newCategories = [...categories];
    newCategories[catIdx].questions[qIdx].options.splice(optIdx, 1);
    setCategories(newCategories);
  };

  const handleOptionAnomalyChange = (catIdx, qIdx, optIdx, value) => {
    const newCategories = [...categories];
    newCategories[catIdx].questions[qIdx].options[optIdx].isAnomaly = value;
    setCategories(newCategories);
  };

  const handleChangeQuestion = (catIdx, qIdx, field, value) => {
    const newCategories = [...categories];

    if (field === "position") {
      const newPosition = parseInt(value);
      const questions = [...newCategories[catIdx].questions];
      const currentQuestion = questions[qIdx];

      if (isNaN(newPosition) || newPosition <= 0) {
        toast.error("A posição deve ser maior que zero.");
        return;
      }

      const finalPosition = Math.min(newPosition, questions.length);
      const filtered = questions.filter((q) => q.id !== currentQuestion.id);
      filtered.splice(finalPosition - 1, 0, currentQuestion);
      const reordered = filtered.map((q, idx) => ({ ...q, position: idx + 1 }));

      newCategories[catIdx].questions = reordered;
      setCategories(newCategories);
      toast.success(`Pergunta movida para a posição ${finalPosition}!`);
      return;
    } else {
      newCategories[catIdx].questions[qIdx][field] = value;
    }

    setCategories(newCategories);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: checklistName,
        categories: categories.map((cat) => ({
          categoryName: cat.categoryName,
          questions: cat.questions.map((q, idx) => ({
            questionText: q.questionText,
            questionType: q.questionType,
            options:
              q.questionType === "Múltipla escolha"
                ? q.options.map((opt) => ({
                    value: opt.value,
                    isAnomaly: opt.isAnomaly,
                  }))
                : [],
            isRequired: q.isRequired,
            position: idx + 1,
            promptIA: q.promptIA,
          })),
        })),
      };

      await api.post("/checklists", payload);
      toast.success("Checklist publicado com sucesso!");

      setChecklistName("");
      setCategories([
        {
          categoryName: "",
          questions: [
            {
              questionText: "",
              questionType: "Texto",
              options: [],
              isRequired: true,
              position: 1,
              promptIA: "",
              id: Date.now() + Math.random(),
            },
          ],
        },
      ]);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao publicar o checklist!");
    }
  };

  return (
    <Box p={4} bgcolor="#141B2D" color="#fff">
      <Paper
        elevation={3}
        sx={{ backgroundColor: "#434957", p: 3, borderRadius: 3, mb: 4 }}
      >
        <Typography variant="h6" gutterBottom>
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
              backgroundColor: "#23B3E8",
              px: 2,
              py: 0.5,
              borderRadius: "10px 10px 0 0",
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
            <Box key={q.id} mb={3} p={2} bgcolor="#6E7484" borderRadius={2}>
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
                      width: "800px",
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "#fff" }}>Posição</InputLabel>
                    <Select
                      value={q.position}
                      onChange={(e) =>
                        handleChangeQuestion(
                          catIdx,
                          qIdx,
                          "position",
                          e.target.value
                        )
                      }
                      sx={{ backgroundColor: "#6E7484", color: "#fff" }}
                    >
                      {Array.from({
                        length: categories[catIdx].questions.length,
                      }).map((_, idx) => (
                        <MenuItem key={idx + 1} value={idx + 1}>
                          {idx + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={3}>
                  <FormControl fullWidth sx={{ width: "300px" }}>
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
                      justifyContent="space-between"
                      mb={1}
                    >
                      <Radio disabled />
                      <TextField
                        value={opt.value}
                        placeholder={`Opção ${optIdx + 1}`}
                        onChange={(e) => {
                          const newCategories = [...categories];
                          newCategories[catIdx].questions[qIdx].options[
                            optIdx
                          ].value = e.target.value;
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
                        sx={{ left: -80 }}
                      >
                        <CloseOutlined sx={{ color: "white" }} />
                      </IconButton>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={opt.isAnomaly}
                            onChange={(e) =>
                              handleOptionAnomalyChange(
                                catIdx,
                                qIdx,
                                optIdx,
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Marcar como anomalia"
                        sx={{ color: "white" }}
                      />
                    </Box>
                  ))}
                  <Divider sx={{ my: 2, backgroundColor: "#7ec8f2" }} />

                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#fff",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <MenuIcon fontSize="small" />
                    Tipo de Resposta
                  </Typography>
                  <FormControl fullWidth>
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
                      sx={{ backgroundColor: "#3b4050", color: "#fff" }}
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

                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddCircleOutline />}
                    onClick={() => handleAddOption(catIdx, qIdx)}
                    sx={{ color: "white", mt: 2 }}
                  >
                    Adicionar opção
                  </Button>
                </Box>
              )}

              {(q.questionType === "Texto" ||
                q.questionType === "Upload de arquivo") && (
                <Box mt={2}>
                  <TextField
                    fullWidth
                    placeholder="Digite o prompt que a IA utilizará para definir o que será uma anomalia"
                    value={q.promptIA || ""}
                    onChange={(e) =>
                      handleChangeQuestion(
                        catIdx,
                        qIdx,
                        "promptIA",
                        e.target.value
                      )
                    }
                    sx={{
                      backgroundColor: "#6E7484 ",
                      input: { color: "#fff" },
                    }}
                  />

                  
                  {q.questionType === "Texto" && (
                    <>
                    <Divider sx={{ my: 2, backgroundColor: "#7ec8f2" }} />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#fff",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <MenuIcon fontSize="small" />
                    Tipo de Resposta
                  </Typography>
                  <FormControl fullWidth>
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
                      sx={{ backgroundColor: "#3b4050", color: "#fff" }}
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
                    </>
                  )}

                  
                </Box>
              )}

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
          "&:hover": { backgroundColor: "#1499e6" },
        }}
      >
        Publicar checklist
      </Button>

      <ToastContainer />
    </Box>
  );
};

export default ChecklistForm;
