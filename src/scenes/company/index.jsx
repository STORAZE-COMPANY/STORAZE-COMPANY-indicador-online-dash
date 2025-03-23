import { Box, Typography, Button, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { AddBusinessOutlined } from "@mui/icons-material";

const mockDataEmpresas = [
  {
    id: 1,
    nome: "TransLog",
    cidade: "Lisboa",
    contacto: "+351 912 345 678",
    email: "info@translog.pt",
    status: "Ativa",
  },
  {
    id: 2,
    nome: "RápidoTrans",
    cidade: "Porto",
    contacto: "+351 923 456 789",
    email: "contato@rapidotrans.pt",
    status: "Inativa",
  },
  {
    id: 3,
    nome: "CargaCerta",
    cidade: "Coimbra",
    contacto: "+351 934 567 890",
    email: "apoio@cargacerta.pt",
    status: "Ativa",
  },
  {
    id: 4,
    nome: "EntregasExpress",
    cidade: "Aveiro",
    contacto: "+351 945 678 901",
    email: "express@entregasexpress.pt",
    status: "Ativa",
  },
  {
    id: 5,
    nome: "VelozCargo",
    cidade: "Braga",
    contacto: "+351 956 789 012",
    email: "suporte@velozcargo.pt",
    status: "Inativa",
  },
];

const Company = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  
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
  ];

  const handleCriarEmpresaClick = () => {
    console.log("chegou")
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
          rows={mockDataEmpresas}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Company;
