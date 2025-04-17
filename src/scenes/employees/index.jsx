import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  TablePagination,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { AddOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material";
import { getIndicadorOnlineAPI } from "../../api/generated/api";
import { toast } from "react-toastify";

const Employees = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const {
    employeesControllerFindList,
    employeesControllerRemove,
    checklistsControllerFindPaginatedByEmployeeParams,
  } = getIndicadorOnlineAPI();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeesControllerFindList({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
      });

      const formatted = await Promise.all(
        response.map(async (item) => {
          let relatedChecklists = [];
          try {
            relatedChecklists = await checklistsControllerFindPaginatedByEmployeeParams({
              employeeId: item.id.toString(),
            });
          } catch (err) {
            console.error(`Erro ao buscar checklists do funcionário ${item.name}`);
          }

          return {
            id: item.id,
            nome: item.name,
            email: item.email,
            telefone: item.phone,
            empresa: item.company_name,
            nivel: item.role_name,
            company_id: item.company_id,
            role_id: item.role_id,
            checklistsRelacionados: relatedChecklists.map((cl) => cl.checklistName).join(", "),
          };
        })
      );

      setEmployees(formatted);
      setHasNextPage(response.length === rowsPerPage);
    } catch (err) {
      toast.error("Erro ao buscar funcionários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage]);

  const handleEditarFuncionario = (row) => {
    navigate("/create-employees", {
      state: {
        id: row.id,
        name: row.nome,
        email: row.email,
        phone: row.telefone,
        company_id: row.company_id,
        roleId: row.role_id,
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      await employeesControllerRemove(id);
      toast.success("Funcionário removido com sucesso!");
      fetchEmployees();
    } catch (err) {
      toast.error("Erro ao remover funcionário.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.4 },
    { field: "nome", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "telefone", headerName: "Telefone", flex: 1 },
    { field: "empresa", headerName: "Empresa", flex: 1 },
    { field: "nivel", headerName: "Nível de Acesso", flex: 1 },
    { field: "checklistsRelacionados", headerName: "Checklists Relacionados", flex: 1.5 },
    {
      field: "acoes",
      headerName: "Ações",
      flex: 0.8,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Editar">
            <IconButton onClick={() => handleEditarFuncionario(row)}>
              <EditOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton onClick={() => handleDelete(row.id)}>
              <DeleteOutline color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleChangePage = (event, newPage) => {
    if (newPage > page && !hasNextPage) return;
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Funcionários" subtitle="Gerenciar Equipe" />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddOutlined />}
          onClick={() => navigate("/create-employees")}
        >
          Adicionar Funcionário
        </Button>
      </Box>

      <Box
        mt="40px"
        height="72vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { border: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={employees}
          columns={columns}
          disableRowSelectionOnClick
          hideFooter
          loading={loading}
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <TablePagination
          component="div"
          count={-1}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
          nextIconButtonProps={{ disabled: !hasNextPage }}
          sx={{
            color: "#fff",
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
              color: "#fff",
            },
            ".MuiSvgIcon-root": { color: "#fff" },
          }}
        />
      </Box>
    </Box>
  );
};

export default Employees;