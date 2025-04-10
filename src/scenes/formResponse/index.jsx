// Arquivo: FormResponses.jsx
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  FileDownload,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getIndicadorOnlineAPI } from "../../api/generated/api";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

const headCells = [
  { id: "nome", label: "Nome do Checklist" },
  { id: "data", label: "Data" },
  { id: "empresa", label: "Empresa" },
  { id: "colaborador", label: "Colaborador" },
  { id: "anomalia", label: "Anomalia" },
];

const FormResponses = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("nome");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(14);

  const { answersControllerFindAnswersWithCheckList } = getIndicadorOnlineAPI();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await answersControllerFindAnswersWithCheckList();

        const grouped = responses.reduce((acc, answer) => {
          const key = `${answer.question_id}-${answer.employee_id}`;
          console.log("answer", answer)
          if (!acc[key]) {
            acc[key] = {
              id: answer.id,
              nome: answer.checklistName || "Checklist",
              data: answer.created_at || new Date().toISOString(),
              empresa: answer?.CompanyName || "-",
              colaborador: answer?.EmployeeName || "-",
              anomalia: answer.hasAnomaly,
            };
          }
          return acc;
        }, {});

        setData(Object.values(grouped));
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportCSV = () => {
    const headers = ["ID", "Nome", "Data", "Empresa", "Colaborador", "Anomalia"];
    const rows = data.map((r) => [
      r.id,
      r.nome,
      new Date(r.data).toLocaleDateString(),
      r.empresa,
      r.colaborador,
      r.anomalia ? "Sim" : "Não",
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "checklist_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box p={4} bgcolor="#141B2D" minHeight="100vh">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" sx={{ color: "white" }}>
          CheckList Respondidos
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FileDownload />}
          onClick={exportCSV}
          sx={{ color: "white", borderColor: "white" }}
        >
          Exportar CSV
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: "#1E2533", borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#6E7484" }}>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => handleRequestSort(headCell.id)}
                      sx={{
                        color: "white",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, idx) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? "#2A3142" : "#1E2533",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/checklist/${row.id}`)}
                  >
                    <TableCell sx={{ color: "white" }}>{row.nome}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {new Date(row.data).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>{row.empresa}</TableCell>
                    <TableCell sx={{ color: "white" }}>{row.colaborador}</TableCell>
                    <TableCell>
                      {row.anomalia ? (
                        <Error sx={{ color: "#E74C3C" }} />
                      ) : (
                        <CheckCircle sx={{ color: "#2ECC71" }} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[14]}
            sx={{ color: "white", backgroundColor: "#1E2533" }}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default FormResponses;