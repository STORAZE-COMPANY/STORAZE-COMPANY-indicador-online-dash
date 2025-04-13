// Arquivo: ChecklistDetail.jsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const ChecklistDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const checklist = location.state;

  // Função para renderizar a resposta de acordo com o tipo da questão
  const renderResposta = (qa) => {
    // Verifica o tipo da questão para renderizar a resposta conforme necessário
    if (qa.type === "Múltipla escolha") {
      // Para múltipla escolha, exibe o valor selecionado
      return (
        <Typography sx={{ color: "white" }}>
          Resposta: {qa.answer}
        </Typography>
      );
    } else if (qa.type === "Texto") {
      // Para resposta em texto, exibe o texto da resposta
      return (
        <Typography sx={{ color: "white" }}>
          Resposta: {qa.answer}
        </Typography>
      );
    } else if (
      qa.type === "Upload de arquivo" ||
      qa.type.toLowerCase().includes("imagem")
    ) {
      // Para imagens, renderiza uma tag de imagem (caso haja uma URL válida na resposta)
      return qa.answer ? (
        <img
          src={qa.answer}
          alt="Resposta"
          style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 4 }}
        />
      ) : (
        <Typography sx={{ color: "white" }}>
          Nenhuma imagem enviada.
        </Typography>
      );
    } else {
      // Caso não caia em nenhum dos tipos acima, renderiza como texto
      return (
        <Typography sx={{ color: "white" }}>
          Resposta: {qa.answer}
        </Typography>
      );
    }
  };

  // Se nenhum checklist foi passado, exibe mensagem e botão de voltar
  if (!checklist) {
    return (
      <Box p={4}>
        <Typography variant="h6" sx={{ color: "white" }}>
          Nenhum dado de checklist foi fornecido.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
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
      <Button
        variant="contained"
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
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

        <Box mt={4}>
          <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
            Perguntas e Respostas:
          </Typography>
          {checklist.questions && checklist.questions.length > 0 ? (
            <List>
              {checklist.questions.map((qa, index) => (
                <ListItem
                  key={index}
                  sx={{ bgcolor: "#2A3142", mb: 1, borderRadius: 1 }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ color: "white" }}>
                        {qa.question}
                      </Typography>
                    }
                    secondary={renderResposta(qa)}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            // Caso não haja array de questões, verifica se há resposta única
            <Typography sx={{ color: "white" }}>
              Pergunta: {checklist.question} <br />
              Resposta: {checklist.answer}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Botões de ação no final da página */}
      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        <Button variant="outlined" color="error" onClick={() => console.log("Checklist não aprovado")}>
          Não aprovar
        </Button>
        <Button variant="contained" color="success" onClick={() => console.log("Checklist aprovado")}>
          Aprovar
        </Button>
      </Box>
    </Box>
  );
};

export default ChecklistDetail;