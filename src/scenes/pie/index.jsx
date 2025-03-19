import { Box } from "@mui/material";
import { Header, PieChart } from "../../components";

const Pie = () => {
  return (
    <Box m="20px">
      {/* <Header title="Pie Chart" subtitle="Simple Pie Chart" /> */}
      <Header title="Gráfico" subtitle="Gráfico" />
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
