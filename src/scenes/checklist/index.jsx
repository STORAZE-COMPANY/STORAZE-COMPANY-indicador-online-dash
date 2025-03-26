import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { Delete, Edit, AddCircleOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// dados mocados
const MOCKED_CHECKLISTS = [
  {
    id: 1,
    name: "Checklist de Segurança",
    categories: [
      {
        categoryName: "Portões",
        questions: [],
      },
    ],
  },
  {
    id: 2,
    name: "Checklist de Limpeza",
    categories: [],
  },
];

const ChecklistList = () => {
  const [checklists, setChecklists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // simula carregamento
    setTimeout(() => {
      setChecklists(MOCKED_CHECKLISTS);
    }, 500);
  }, []);

  const handleDelete = (id) => {
    toast.success("Checklist removido!");
    setChecklists((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreate = () => {
    navigate("/checklistform");
  };

  return (
    <Box p={4} bgcolor="#141B2D" minHeight="100vh" color="#fff">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" color="#7ec8f2">
          Checklists Criados
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddCircleOutline />}
          onClick={handleCreate}
          sx={{
            backgroundColor: "#7ec8f2",
            color: "#000",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#1499e6",
            },
          }}
        >
          Criar novo checklist
        </Button>
      </Box>

      {checklists.length === 0 ? (
        <Typography variant="body1">Nenhum checklist encontrado.</Typography>
      ) : (
        checklists.map((checklist) => (
          <Paper
            key={checklist.id}
            elevation={3}
            sx={{
              backgroundColor: "#434957",
              p: 2,
              borderRadius: 3,
              mb: 3,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h6" color="#fff">
                {checklist.name}
              </Typography>
              <Box>
                <Tooltip title="Editar (em breve)">
                  <IconButton disabled>
                    <Edit sx={{ color: "#7ec8f2" }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton onClick={() => handleDelete(checklist.id)}>
                    <Delete sx={{ color: "#f44336" }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Divider sx={{ backgroundColor: "#7ec8f2", mb: 1 }} />

            <Typography variant="body2" color="gray">
              {checklist.categories?.length || 0} categoria(s)
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default ChecklistList;
