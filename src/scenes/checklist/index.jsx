import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Delete,
  Edit,
  AddCircleOutline,
  SettingsOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getIndicadorOnlineAPI } from "../../api/generated/api";

const ChecklistList = () => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { checklistsControllerFindPaginatedByParams } = getIndicadorOnlineAPI();

  const fetchChecklists = async () => {
    try {
      const data = await checklistsControllerFindPaginatedByParams({
        limit: "10",
        page: "1",
      });
      console.log("checklists", data);
      setChecklists(data);
    } catch (err) {
      toast.error("Erro ao carregar checklists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const handleDelete = (id) => {
    toast.success("Checklist removido!");
    setChecklists((prev) => prev.filter((c) => c.checklistItemId !== id));
  };

  const handleCreate = () => {
    navigate("/checklistform");
  };

  return (
    <Box p={4} bgcolor="#141B2D" minHeight="100vh" color="#fff">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
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

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="info" />
        </Box>
      ) : checklists.length === 0 ? (
        <Typography variant="body1">Nenhum checklist encontrado.</Typography>
      ) : (
        checklists.map((checklist) => (
          <Paper
            key={checklist.checklistItemId}
            elevation={3}
            sx={{ backgroundColor: "#434957", p: 2, borderRadius: 3, mb: 3 }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h6" color="#fff">
                {checklist.checklistName}
              </Typography>
              <Box>
                <Tooltip title="Editar (em breve)">
                  <IconButton disabled>
                    <Edit sx={{ color: "#7ec8f2" }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Configuração">
                  <IconButton
                    aria-label="settings"
                    onClick={() => {
                      navigate(`/checklists/${checklist.checklistItemId}/settings`);
                    }}
                  >
                    <SettingsOutlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton
                    onClick={() => handleDelete(checklist.checklistItemId)}
                  >
                    <Delete sx={{ color: "#f44336" }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Divider sx={{ backgroundColor: "#7ec8f2", mb: 1 }} />

            <Typography variant="body2" color="gray">
              Empresa: {checklist.companyName || "Não vinculada"}
            </Typography>
            <Typography variant="body2" color="gray">
              Categoria ID: {checklist.categories_id}
            </Typography>
            <Typography variant="body2" color="gray">
              Contém anomalias? {checklist.hasAnomalies ? "Sim" : "Não"}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default ChecklistList;
