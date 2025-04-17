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
  const { id: checklistId } = useParams();
  const {
    companiesControllerFindAll,
    checklistsControllerUpdateExpiriesTime,
    checklistsControllerConnectCheckListToCompany,
  } = getIndicadorOnlineAPI();

  const [companies, setCompanies] = useState([]);
  const [expirationDate, setExpirationDate] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);

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
      const isoDate = new Date(`${expirationDate}T23:59:59.000Z`).toISOString();
      await checklistsControllerUpdateExpiriesTime({
        expiriesTime: isoDate,
        imagesExpiriesTime: isoDate,
        checkListId: checklistId,
      });
      toast.success("Data de expiração atualizada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar a data de expiração.");
    }
  };

  const handleConnectCompanies = async () => {
    if (!selectedCompanies.length) {
      toast.error("Selecione ao menos uma empresa.");
      return;
    }

    try {
      const payload = selectedCompanies.map((companyId) => ({
        companyId: Number(companyId),
        checklistId,
        categories_id: "",
      }));

      await checklistsControllerConnectCheckListToCompany(payload);
      toast.success("Empresas conectadas ao checklist com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao conectar empresas ao checklist.");
    }
  };

  return (
    <Box p={4} bgcolor="#141B2D" color="#fff">
      <Typography variant="h4" mb={3} color="#7ec8f2">
        Configuração do Checklist
      </Typography>

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

      <Box mb={4}>
        <Typography variant="h6" mb={2}>
          Conectar Empresas ao Checklist
        </Typography>
        <FormControl fullWidth sx={{ backgroundColor: "#3b4050", mb: 2 }}>
          <InputLabel sx={{ color: "#fff" }}>Empresas</InputLabel>
          <Select
            multiple
            value={selectedCompanies}
            onChange={(e) => setSelectedCompanies(e.target.value)}
            input={<OutlinedInput label="Empresas" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => {
                  const company = companies.find((c) => c.id.toString() === value);
                  return <Chip key={value} label={company?.name || value} />;
                })}
              </Box>
            )}
            sx={{ color: "#fff" }}
          >
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id.toString()}>
                {company.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="secondary" onClick={handleConnectCompanies}>
          CONECTAR EMPRESAS
        </Button>
      </Box>

      <ToastContainer />
    </Box>
  );
};

export default SettingsChecklist;
