import { Box, useTheme } from "@mui/material";
import { Header, GeographyChart } from "../../components";
import { tokens } from "../../theme";

const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      {/* <Header title="Geography" subtitle="Simple Geography Chart" /> */}
      <Header title="Gráfico" subtitle="Gráfico" />

      <Box
        height="75vh"
        border={`1px solid ${colors.gray[100]}`}
        borderRadius="4px"
      >
        <GeographyChart />
      </Box>
    </Box>
  );
};

export default Geography;
