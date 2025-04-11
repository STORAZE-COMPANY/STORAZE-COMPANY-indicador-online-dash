import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getIndicadorOnlineAPI } from "../../api/generated/api";

const SettingsChecklist = () => {
  const { id: checkListId } = useParams(); 
  const {
    companiesControllerFindAll, 
    checklistsControllerUpdateExpiriesTime,
    checklistsControllerUpdateCompanyId
  } = getIndicadorOnlineAPI();

  const [companies, setCompanies] = useState([]);
  const [expirationDate, setExpirationDate] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companiesControllerFindAll();
        setCompanies(response);
      } catch (error) {
        toast.error("Erro ao carregar empresas.");
      }
    };

    fetchCompanies();
  }, []);

  const handleUpdateExpiries = async () => {
    if (!expirationDate.trim()) {
      toast.error("Insira uma data válida.");
      return;
    }
    try {
      const payload = {
        expiriesTime: expirationDate,
        imagesExpiriesTime: expirationDate, 
        checkListId, 
      };
      await checklistsControllerUpdateExpiriesTime(payload);
      toast.success("Data de expiração atualizada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar a data de expiração.");
    }
  };

  const handleUpdateCompanies = async () => {
    if (!selectedCompany) {
      toast.error("Selecione uma empresa.");
      return;
    }
    try {
      const payload = {
        companyId: Number(selectedCompany),
        checkListItemId: checkListId,
      };
      await checklistsControllerUpdateCompanyId(payload);
      toast.success("Empresa relacionada atualizada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar a empresa relacionada.");
    }
  };

  const handleSave = async () => {
    await handleUpdateExpiries();
    await handleUpdateCompanies();
  };

  return (
    <Box p={4} bgcolor="#141B2D" color="#fff">
      <Typography variant="h4" mb={3} color="#7ec8f2">
        Settings Checklist
      </Typography>

      {/* Seção de atualização da data de expiração */}
      <Box mb={4}>
        <Typography variant="h6" mb={2}>
          Configurar Data de Expiração
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} width="250px">
          <TextField
            label="Data de Expiração"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              backgroundColor: "#3b4050",
              input: { color: "#fff" },
              label: { color: "#7ec8f2" },
            }}
          />
          <Button variant="contained" color="secondary" onClick={handleUpdateExpiries}>
            ATUALIZAR DATA
          </Button>
        </Box>
      </Box>

      {/* Seção de seleção da empresa relacionada */}
      <Box mb={4}>
        <Typography variant="h6" mb={2}>
          Configurar Empresa Relacionada
        </Typography>
        <FormControl fullWidth sx={{ backgroundColor: "#3b4050", mb: 2 }}>
          <InputLabel sx={{ color: "#fff" }}>Empresa</InputLabel>
          <Select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            input={<OutlinedInput label="Empresa" />}
            sx={{ color: "#fff" }}
          >
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="secondary" onClick={handleUpdateCompanies}>
          ATUALIZAR EMPRESA
        </Button>
      </Box>

      {/* Botão para salvar ambas as configurações */}
     {/*  <Box>
        <Button variant="contained" color="success" onClick={handleSave}>
          SALVAR CONFIGURAÇÕES
        </Button>
      </Box> */}

      <ToastContainer />
    </Box>
  );
};

export default SettingsChecklist;