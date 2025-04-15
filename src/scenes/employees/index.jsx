import { useEffect, useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { AddBusinessOutlined } from "@mui/icons-material";
import { getIndicadorOnlineAPI } from "../../api/generated/api";
import { toast } from "react-toastify";

const Employees = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { employeesControllerFindList } = getIndicadorOnlineAPI();

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeesControllerFindList({
          limit: "50",
          page: "1",
        });

        const formatted = response.map((emp) => ({
          id: emp.id,
          nome: emp.name,
          email: emp.email,
          telefone: emp.phone,
          empresaName: emp.company_name,
          cargo: emp.role_name,
          company_id: emp.company_id,
          role_id: emp.role_id,
        }));

        setEmployees(formatted);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao buscar funcionários");
      }
    };

    fetchEmployees();
  }, [employeesControllerFindList]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.4 },
    {
      field: "nome",
      headerName: "Nome do Funcionário",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "telefone", headerName: "Telefone", flex: 0.8 },
    { field: "empresaName", headerName: "Empresa", flex: 0.6 },
    { field: "cargo", headerName: "Nível de Acesso", flex: 0.8 },
    {
      field: "acoes",
      headerName: "Ações",
      flex: 0.6,
      sortable: false,
      renderCell: ({ row }) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleEditarFuncionario(row)}
        >
          Editar
        </Button>
      ),
    },
  ];

  const handleCriarFuncionarioClick = () => {
    navigate("/create-employees");
  };

  const handleEditarFuncionario = (row) => {
    navigate("/create-employees", {
      state: {
        id: row.id,
        name: row.nome,
        email: row.email,
        phone: row.telefone,
        company_id: row.company_id,
        role_id: row.role_id,
      },
    });
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Funcionários" subtitle="Gerenciar Funcionários" />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddBusinessOutlined />}
          onClick={handleCriarFuncionarioClick}
        >
          Criar Funcionário
        </Button>
      </Box>

      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { border: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
        }}
      >
        <DataGrid
          rows={employees}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Employees;