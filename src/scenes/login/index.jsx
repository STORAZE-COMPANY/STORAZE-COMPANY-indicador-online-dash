import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { tokens } from "../../theme";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { getIndicadorOnlineAPI } from "../../api/generated/api";

const Login = () => {
  const darkTheme = createTheme({ palette: { mode: "dark" } });
  const theme = useTheme();
  const colors = tokens("dark");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {authControllerLoginDashboard} = getIndicadorOnlineAPI()


  const handleLogin = async () => {
    try {
      const { access_token, refresh_token } = await authControllerLoginDashboard({
        email,
        password,
      });
  
      login({ access_token, refresh_token });
  
      navigate("/checklists");
    } catch (error) {
      console.log("error", error)
      toast.error("Credenciais inválidas");
    }
  };
  

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor={colors.primary[500]}
      >
        <Box
          width="400px"
          p={4}
          borderRadius="10px"
          bgcolor={colors.primary[400]}
          boxShadow={4}
        >
          <Typography variant="h4" mb={2} color={colors.greenAccent[400]}>
            Login
          </Typography>

          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ style: { color: colors.grey } }}
            InputLabelProps={{ style: { color: colors.grey } }}
          />

          <TextField
            fullWidth
            label="Senha"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ style: { color: colors.grey } }}
            InputLabelProps={{ style: { color: colors.grey } }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: colors.greenAccent[600],
              "&:hover": { backgroundColor: colors.greenAccent[700] },
              color: "#fff",
            }}
            onClick={handleLogin}
          >
            Entrar
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default Login;
