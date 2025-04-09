import { useEffect, useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { AddBusinessOutlined } from "@mui/icons-material";
import { getIndicadorOnlineAPI } from "../../api/generated/api";
import { toast } from "react-toastify";

const Category = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { categoriesControllerFindList } = getIndicadorOnlineAPI();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesControllerFindList();

        console.log("response",response);
        

        const formatted = response?.map((cat) => ({
          id: cat.id,
          nome: cat.name,
          dataCriacao: new Date(cat.created_at).toLocaleDateString(),
          dataAtualizacao: new Date(cat.updated_at).toLocaleDateString(),
        }));

        setCategories(formatted);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao buscar categorias");
      }
    };

    fetchCategories();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.4 },
    {
      field: "nome",
      headerName: "Nome da Categoria",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "dataCriacao", headerName: "Criado em", flex: 0.8 },
    { field: "dataAtualizacao", headerName: "Atualizado em", flex: 0.8 },
  ];

  const handleCriarCategoriaClick = () => {
    navigate("/create-category");
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Categorias" subtitle="Gerenciar Categorias" />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddBusinessOutlined />}
          onClick={handleCriarCategoriaClick}
        >
          Criar Categoria
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
          rows={categories}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Category;