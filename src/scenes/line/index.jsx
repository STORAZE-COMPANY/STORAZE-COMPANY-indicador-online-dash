import { Box } from "@mui/material";
import { Header, LineChart } from "../../components";

const Line = () => {
  return (
    <Box m="20px">
      {/* <Header title="Line Chart" subtitle="Simple Line Chart" /> */}
      <Header title="Gráfico" subtitle="Gráfico" />
      <Box height="75vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default Line;
