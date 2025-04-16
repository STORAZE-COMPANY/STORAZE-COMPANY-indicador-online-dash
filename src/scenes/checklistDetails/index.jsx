import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getIndicadorOnlineAPI } from "../../api/generated/api";
import { ToastContainer, toast } from "react-toastify";

const ChecklistDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const checklist = location.state;

  const {
    answersControllerFindAnomalyResolutionById,
    answersControllerUpdateAnomalyResolution,
  } = getIndicadorOnlineAPI();

  const [resolucao, setResolucao] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResolucao = async () => {
    try {
      if (checklist?.id && checklist.hasAnomaly) {
        const result = await answersControllerFindAnomalyResolutionById({
          answer_id: checklist.id,
        });

        setResolucao(result);
      }
    } catch (err) {
      toast.error("Erro ao buscar resolução");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAtualizarStatus = async (status) => {
    try {
      await answersControllerUpdateAnomalyResolution({
        id: resolucao.id,
        status,
        employee_Id: checklist.employee_id,
      });
      toast.success(
        `Resolução ${
          status === "RESOLVED" ? "aprovada" : "rejeitada"
        } com sucesso`
      );
      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (err) {
      toast.error("Erro ao atualizar resolução");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResolucao();
  }, []);

  const renderResposta = () => {
    if (
      checklist.type === "Upload de arquivo" ||
      checklist.type.toLowerCase().includes("imagem")
    ) {
      return checklist.answer ? (
        <img
          src={checklist.answer}
          alt="Resposta"
          style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 4 }}
        />
      ) : (
        <Typography sx={{ color: "white" }}>Nenhuma imagem enviada.</Typography>
      );
    }

    return (
      <Typography sx={{ color: "white" }}>
        Resposta: {checklist.answer}
      </Typography>
    );
  };

  if (!checklist) {
    return (
      <Box p={4}>
        <Typography variant="h6" sx={{ color: "white" }}>
          Nenhum dado de checklist foi fornecido.
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      bgcolor="#141B2D"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Voltar
      </Button>

      <Paper sx={{ p: 4, bgcolor: "#1E2533", flexGrow: 1 }}>
        <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
          Detalhes do Checklist
        </Typography>

        <Typography variant="subtitle1" sx={{ color: "white" }}>
          Empresa: {checklist.companyName}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "white" }}>
          Colaborador: {checklist.employeeName}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "white" }}>
          Data: {new Date(checklist.created_at).toLocaleDateString()}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "white", mb: 2 }}>
          Anomalia: {checklist.hasAnomaly ? "Sim" : "Não"}
        </Typography>

        <Box mt={2} sx={{ bgcolor: "#2A3142", p: 2, borderRadius: 2 }}>
          <Typography sx={{ color: "#7ec8f2", fontWeight: "bold" }}>
            {checklist.question}
          </Typography>

          <Box mt={1}>{renderResposta()}</Box>
        </Box>

        {checklist.hasAnomaly && (
          <Paper sx={{ bgcolor: "#3a4256", mt: 4, p: 3 }}>
            <Typography variant="h6" sx={{ color: "#7ec8f2", mb: 2 }}>
              Resolução da Anomalia
            </Typography>

            {loading ? (
              <CircularProgress color="info" />
            ) : resolucao ? (
              <>
                <Typography sx={{ color: "white", mb: 1 }}>
                  <strong>Descrição:</strong> {resolucao.description}
                </Typography>
                {resolucao.imageUrl && (
                  <img
                    src={resolucao.imageUrl}
                    alt="Imagem da resolução"
                    style={{
                      maxWidth: "100%",
                      borderRadius: 4,
                      marginBottom: 16,
                    }}
                  />
                )}

                {resolucao.status === "RESOLVED" ? (
                  <Box
                    mt={2}
                    p={2}
                    sx={{
                      backgroundColor: "#2e7d32",
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography sx={{ color: "#fff", fontWeight: "bold" }}>
                      ✅ Resolução já aprovada
                    </Typography>
                  </Box>
                ) : (
                  <Box mt={2} display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleAtualizarStatus("REJECTED")}
                    >
                      Não aprovar
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAtualizarStatus("RESOLVED")}
                    >
                      Aprovar
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Typography sx={{ color: "#ccc" }}>
                Nenhuma resolução enviada.
              </Typography>
            )}
          </Paper>
        )}
      </Paper>
      <ToastContainer />
    </Box>
  );
};

export default ChecklistDetail;
