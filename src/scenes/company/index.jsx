import { useEffect, useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { AddBusinessOutlined } from "@mui/icons-material";
import { getIndicadorOnlineAPI } from "../../api/generated/api";
import { toast } from "react-toastify";

const Company = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { companiesControllerFindAll } = getIndicadorOnlineAPI();

  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companiesControllerFindAll();
        console.log("response", response)
        const formatted = response.map((item) => ({
          id: item.id,
          nome: item.name,
          email: item.email,
          status: item.isActive ? "Ativa" : "Inativa",
          cidade: "N/A", 
          contacto: "N/A", 
          checklists: [], 
        }));
        setEmpresas(formatted);
      } catch (err) {
        toast.error("Erro ao buscar empresas");
      }
    };

    fetchCompanies();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "nome",
      headerName: "Nome da Empresa",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "cidade", headerName: "Cidade", flex: 1 },
    { field: "contacto", headerName: "Contato", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: ({ row: { status } }) => (
        <Box
          width="80px"
          p={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={1}
          bgcolor={
            status === "Ativa" ? colors.greenAccent[600] : colors.redAccent[400]
          }
        >
          <Typography color="#fff">{status}</Typography>
        </Box>
      ),
    },
    {
      field: "checklists",
      headerName: "Checklists",
      flex: 1.5,
      renderCell: ({ row: { checklists } }) => (
        <Box display="flex" flexWrap="wrap" gap={1}>
          {checklists?.length ? (
            checklists.map((name, idx) => (
              <Box
                key={idx}
                px={1}
                py={0.5}
                borderRadius={1}
                bgcolor={colors.blueAccent[600]}
              >
                <Typography variant="caption" color="#fff">
                  {name}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="caption" color="gray">
              Nenhum checklist
            </Typography>
          )}
        </Box>
      ),
    },
  ];

  const handleCriarEmpresaClick = () => {
    navigate("/create-company");
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Empresas" subtitle="Gerenciar Empresas" />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddBusinessOutlined />}
          onClick={handleCriarEmpresaClick}
        >
          Criar Empresa
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
          rows={empresas}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Company;
