import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  TablePagination,
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
import { useAuth } from "../../contexts/AuthContext"; // <- Importa contexto

const ChecklistList = () => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const navigate = useNavigate();

  const { dataAuth } = useAuth(); // <- Pega o papel do usuário
  const isAdmin = dataAuth?.user?.role === "superAdmin";

  const {
    checklistsControllerFindPaginatedByParams,
    checklistsControllerRemove,
  } = getIndicadorOnlineAPI();

  const fetchChecklists = async () => {
    setLoading(true);
    try {
      const response = await checklistsControllerFindPaginatedByParams({
        limit: rowsPerPage.toString(),
        page: (page + 1).toString(),
      });

      setChecklists(response);
      setHasNextPage(response.length === rowsPerPage);
    } catch (err) {
      toast.error("Erro ao carregar checklists.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, [page, rowsPerPage]);

  const handleDelete = async (id) => {
    try {
      await checklistsControllerRemove(id);
      toast.success("Checklist removido com sucesso!");
      fetchChecklists();
    } catch (err) {
      toast.error("Erro ao remover checklist.");
      console.error(err);
    }
  };

  const handleCreate = () => {
    navigate("/checklistform");
  };

  const handleChangePage = (event, newPage) => {
    if (newPage > page && !hasNextPage) return;
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        {isAdmin && (
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
        )}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="info" />
        </Box>
      ) : checklists.length === 0 ? (
        <Typography variant="body1">Nenhum checklist encontrado.</Typography>
      ) : (
        <>
          {checklists.map((checklist) => (
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
                {isAdmin && (
                  <Box>
                    <Tooltip title="Editar (em breve)">
                      <IconButton disabled>
                        <Edit sx={{ color: "#7ec8f2" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Configuração">
                      <IconButton
                        aria-label="settings"
                        onClick={() =>
                          navigate(
                            `/checklists/${checklist.checklistItemId}/settings`
                          )
                        }
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
                )}
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
          ))}

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <TablePagination
              component="div"
              count={-1}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Itens por página:"
              sx={{
                color: "#fff",
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                  { color: "#fff" },
                ".MuiSvgIcon-root": { color: "#fff" },
              }}
              nextIconButtonProps={{ disabled: !hasNextPage }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChecklistList;