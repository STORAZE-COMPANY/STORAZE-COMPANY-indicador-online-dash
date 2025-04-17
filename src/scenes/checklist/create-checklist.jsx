import { useEffect, useState } from "react";
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
import { getIndicadorOnlineAPI } from "../../api/generated/api";
import { useNavigate, useParams } from "react-router-dom";

const ChecklistForm = () => {
  const { checklistsControllerCreate, categoriesControllerFindList } =
    getIndicadorOnlineAPI();
    const navigate = useNavigate();

    const { id } = useParams(); 
    const isEditing = !!id;

  const [availableCategories, setAvailableCategories] = useState([]);
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesControllerFindList();
        setAvailableCategories(response);
      } catch (error) {
        toast.error("Erro ao carregar categorias");
      }
    };

    fetchCategories();
  }, []);

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
      anomalyLevel: "",
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

  const handleAnomalyLevelChange = (catIdx, qIdx, optIdx, level) => {
    const newCategories = [...categories];
    newCategories[catIdx].questions[qIdx].options[optIdx].anomalyLevel = level;
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
    } else {
      newCategories[catIdx].questions[qIdx][field] = value;
    }
    setCategories(newCategories);
  };

  const handleSubmit = async () => {
    try {
      const questionList = categories.flatMap((cat) =>
        cat.questions
          .filter((q) => q.questionText.trim() !== "")
          .map((q) => ({
            question: q.questionText,
            category_id: cat.categoryName, 
            type: q.questionType,
            isRequired: q.isRequired,
            answerType:
              q.questionType === "Upload de arquivo"
                ? "Image"
                : q.promptIA
                ? "IA"
                : "Text",
            iaPrompt: q.promptIA || "",
            multiple_choice:
              q.questionType === "Múltipla escolha"
                ? q.options.map((opt) => ({
                    choice: opt.value,
                    anomalyStatus:
                      opt.anomalyLevel === "HIGH"
                        ? "ANOMALIA_RESTRITIVA"
                        : opt.anomalyLevel === "MEDIUM"
                        ? "ANOMALIA"
                        : undefined,
                  }))
                : [],
          }))
      );
  
      if (!checklistName.trim()) {
        toast.error("O nome do checklist é obrigatório.");
        return;
      }
  
      if (questionList.length === 0) {
        toast.error("Adicione pelo menos uma pergunta válida.");
        return;
      }
  
      const payload = {
        name: checklistName,
        question_list: questionList,
      };
  
      await checklistsControllerCreate(payload);
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
  
      setTimeout(() => {
        navigate("/checklists");
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao publicar o checklist!");
    }
  };

  return (
    <Box p={4} bgcolor="#141B2D" color="#fff">
      <Typography variant="h4" mb={3} color="#7ec8f2">
        Criar Checklist
      </Typography>

      <Paper
        elevation={3}
        sx={{ backgroundColor: "#434957", p: 3, borderRadius: 3, mb: 4 }}
      >
        <TextField
          fullWidth
          label="Nome do Checklist"
          placeholder="Digite o nome do checklist"
          value={checklistName}
          onChange={(e) => setChecklistName(e.target.value)}
          sx={{
            backgroundColor: "#3b4050",
            input: { color: "#fff" },
            label: { color: "#7ec8f2" },
            mb: 2,
          }}
        />
      </Paper>

      {categories.map((cat, catIdx) => (
        <Paper
          key={catIdx}
          elevation={3}
          sx={{ mb: 4, p: 2, bgcolor: "#434957", borderRadius: 3 }}
        >
          <Typography variant="h6" color="#7ec8f2" gutterBottom>
            Categoria
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: "#fff" }}>Categoria</InputLabel>
            <Select
              value={cat.categoryName}
              onChange={(e) => {
                const newCategories = [...categories];
                newCategories[catIdx].categoryName = e.target.value;
                setCategories(newCategories);
              }}
              sx={{ backgroundColor: "#3b4050", color: "#fff" }}
            >
              {availableCategories.map((catItem) => (
                <MenuItem key={catItem.id} value={catItem.id}>
                  {catItem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Nova categoria"
              value={cat.newCategoryName || ""}
              onChange={(e) => {
                const newCategories = [...categories];
                newCategories[catIdx].newCategoryName = e.target.value;
                setCategories(newCategories);
              }}
              sx={{
                backgroundColor: "#3b4050",
                input: { color: "#fff" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7ec8f2",
                },
              }}
              InputProps={{ style: { color: "#fff" } }}
            />
            <Button
              variant="outlined"
              onClick={async () => {
                const name = cat.newCategoryName?.trim();
                if (!name)
                  return toast.error("Digite um nome para a nova categoria");

                try {
                  const response =
                    await getIndicadorOnlineAPI().categoriesControllerCreate({
                      name,
                    });
                  setAvailableCategories((prev) => [...prev, response]);
                  const newCategories = [...categories];
                  newCategories[catIdx].categoryName = response.id;
                  newCategories[catIdx].newCategoryName = "";
                  setCategories(newCategories);
                  toast.success("Categoria criada com sucesso!");
                } catch (err) {
                  toast.error("Erro ao criar categoria");
                  console.error(err);
                }
              }}
              sx={{ color: "#7ec8f2", borderColor: "#7ec8f2" }}
            >
              Criar Categoria
            </Button>
          </Box>

          <Divider sx={{ backgroundColor: "#7ec8f2", mb: 1 }} />

          {cat.questions.map((q, qIdx) => (
            <Box key={q.id} mb={3} p={2} bgcolor="#6E7484" borderRadius={2}>
              <TextField
                fullWidth
                label="Pergunta"
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
                  backgroundColor: "#3b4050",
                  input: { color: "#fff" },
                  label: { color: "#7ec8f2" },
                  mb: 2,
                }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: "#fff" }}>Tipo de Pergunta</InputLabel>
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
                  <MenuItem value="Texto">Texto</MenuItem>
                  <MenuItem value="Múltipla escolha">Múltipla escolha</MenuItem>
                  <MenuItem value="Upload de arquivo">
                    Upload de arquivo
                  </MenuItem>
                </Select>
              </FormControl>

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

              <FormControlLabel
                control={
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
                }
                label="Pergunta obrigatória"
                sx={{ color: "#fff", mb: 2 }}
              />

              {q.questionType === "Múltipla escolha" && (
                <Box>
                  {q.options.map((opt, optIdx) => (
                    <Box
                      key={optIdx}
                      display="flex"
                      alignItems="center"
                      mb={1}
                      gap={2}
                      flexWrap="wrap"
                    >
                      <TextField
                        placeholder={`Opção ${optIdx + 1}`}
                        value={opt.value}
                        onChange={(e) => {
                          const newCategories = [...categories];
                          newCategories[catIdx].questions[qIdx].options[
                            optIdx
                          ].value = e.target.value;
                          setCategories(newCategories);
                        }}
                        sx={{
                          flex: 1,
                          backgroundColor: "#3b4050",
                          input: { color: "#fff" },
                        }}
                      />

                      <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel sx={{ color: "#fff" }}>
                          Tipo de Anomalia
                        </InputLabel>
                        <Select
                          value={opt.anomalyLevel || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            const newCategories = [...categories];
                            newCategories[catIdx].questions[qIdx].options[
                              optIdx
                            ].anomalyLevel = value;
                            newCategories[catIdx].questions[qIdx].options[
                              optIdx
                            ].isAnomaly = value !== "";
                            setCategories(newCategories);
                          }}
                          sx={{ backgroundColor: "#3b4050", color: "#fff" }}
                        >
                          <MenuItem value={null}>Sem Anomalia</MenuItem>
                          <MenuItem value="HIGH">Restritiva</MenuItem>
                          <MenuItem value="MEDIUM">Não Restritiva</MenuItem>
                        </Select>
                      </FormControl>

                      <IconButton
                        onClick={() => handleDeleteOption(catIdx, qIdx, optIdx)}
                      >
                        <CloseOutlined sx={{ color: "#fff" }} />
                      </IconButton>
                    </Box>
                  ))}

                  <Button
                    onClick={() => handleAddOption(catIdx, qIdx)}
                    variant="outlined"
                    startIcon={<AddCircleOutline />}
                    sx={{ color: "#7ec8f2", borderColor: "#7ec8f2", mt: 1 }}
                  >
                    Adicionar opção
                  </Button>
                </Box>
              )}

              {(q.questionType === "Texto" ||
                q.questionType === "Upload de arquivo") && (
                <TextField
                  fullWidth
                  label="Prompt IA (opcional)"
                  placeholder="Ex: Verifique se a resposta indica anomalia..."
                  value={q.promptIA}
                  onChange={(e) =>
                    handleChangeQuestion(
                      catIdx,
                      qIdx,
                      "promptIA",
                      e.target.value
                    )
                  }
                  sx={{
                    mt: 2,
                    backgroundColor: "#3b4050",
                    input: { color: "#fff" },
                    label: { color: "#7ec8f2" },
                  }}
                />
              )}

              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  const newCategories = [...categories];
                  newCategories[catIdx].questions.splice(qIdx, 1);
                  setCategories(newCategories);
                }}
                sx={{ mt: 2 }}
              >
                Excluir pergunta
              </Button>
            </Box>
          ))}

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutline />}
              onClick={() => handleAddQuestion(catIdx)}
              sx={{ color: "#7ec8f2", borderColor: "#7ec8f2" }}
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
              Excluir categoria
            </Button>
          </Box>
        </Paper>
      ))}

      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<AddCircleOutline />}
          onClick={handleAddCategory}
          sx={{ color: "#7ec8f2", borderColor: "#7ec8f2" }}
        >
          Adicionar Categoria
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          sx={{
            color: "#000",
            fontWeight: "bold",
            backgroundColor: "#7ec8f2",
            "&:hover": { backgroundColor: "#1499e6" },
          }}
        >
          Publicar checklist
        </Button>
      </Box>

      <ToastContainer />
    </Box>
  );
};

export default ChecklistForm;
