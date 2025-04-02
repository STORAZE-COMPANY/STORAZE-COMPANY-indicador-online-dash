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
  Menu,
  MenuItem,
  IconButton,
  Button,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  FilterList,
  FileDownload,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 🔧 MockData com datas reais
const generateDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const empresas = [
  "Empresa A",
  "Empresa B",
  "Empresa C",
  "Empresa D",
  "Empresa XYZ",
];
const mockData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  nome: "Checklist de Segurança",
  data: generateDate(Math.floor(Math.random() * 730)),
  empresa: empresas[i % empresas.length],
  colaborador: "Colaborador Colaborado de Colaborando",
  anomalia: i % 4 === 0 ? false : true,
}));

const headCells = [
  { id: "nome", label: "Nome do Checklist" },
  { id: "data", label: "Data" },
  { id: "empresa", label: "Empresa" },
  { id: "colaborador", label: "Colaborador" },
  { id: "anomalia", label: "Anomalia" },
];

// 🔽 Funções de ordenação
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

// 🔎 Filtro por datas
const isDateWithinRange = (isoDate, days) => {
  if (days === null) return true;
  const date = new Date(isoDate);
  const now = new Date();
  const threshold = new Date(now.setDate(now.getDate() - days));
  return date <= threshold;
};

const FormResponses = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("nome");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(14);

  const [dateFilter, setDateFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [anomalyFilter, setAnomalyFilter] = useState("all");

  const [anchorEl, setAnchorEl] = useState(null);
  const [companyAnchorEl, setCompanyAnchorEl] = useState(null);
  const [anomalyAnchorEl, setAnomalyAnchorEl] = useState(null);

  const dateOptions = [
    { label: "Qualquer período", value: "all", days: null },
    { label: "Há mais de uma semana", value: "1w", days: 7 },
    { label: "Há mais de um mês", value: "1m", days: 30 },
    { label: "Há mais de seis meses", value: "6m", days: 180 },
    { label: "Há mais de um ano", value: "1y", days: 365 },
  ];
  const selectedDays = dateOptions.find(
    (opt) => opt.value === dateFilter
  )?.days;

  const uniqueCompanies = Array.from(
    new Set(mockData.map((item) => item.empresa))
  );

  // 🧠 Load filtros do localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("filters"));
    if (saved) {
      setDateFilter(saved.dateFilter);
      setCompanyFilter(saved.companyFilter);
      setAnomalyFilter(saved.anomalyFilter);
    }
  }, []);

  // 💾 Save filtros
  useEffect(() => {
    localStorage.setItem(
      "filters",
      JSON.stringify({ dateFilter, companyFilter, anomalyFilter })
    );
  }, [dateFilter, companyFilter, anomalyFilter]);

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

  const handleFilterClick = (e) => setAnchorEl(e.currentTarget);
  const handleCompanyFilterClick = (e) => setCompanyAnchorEl(e.currentTarget);
  const handleAnomalyFilterClick = (e) => setAnomalyAnchorEl(e.currentTarget);

  const handleFilterClose = () => setAnchorEl(null);
  const handleCompanyFilterClose = () => setCompanyAnchorEl(null);
  const handleAnomalyFilterClose = () => setAnomalyAnchorEl(null);

  const handleSelectDateFilter = (value) => {
    setDateFilter(value);
    setCompanyFilter("all");
    setAnomalyFilter("all");
    handleFilterClose();
  };

  const handleSelectCompanyFilter = (value) => {
    setCompanyFilter(value);
    setDateFilter("all");
    setAnomalyFilter("all");
    handleCompanyFilterClose();
  };

  const handleSelectAnomalyFilter = (value) => {
    setAnomalyFilter(value);
    setDateFilter("all");
    setCompanyFilter("all");
    handleAnomalyFilterClose();
  };

  const anomalyOptions = [
    { label: "Mostrar todos", value: "all", icon: null },
    {
      label: "Não contém anomalia",
      value: "true",
      icon: <CheckCircle sx={{ color: "#2ECC71", mr: 1 }} />,
    },
    {
      label: "Contém anomalia",
      value: "false",
      icon: <Error sx={{ color: "#E74C3C", mr: 1 }} />,
    },
  ];

  const filteredByDate = mockData.filter((item) =>
    isDateWithinRange(item.data, selectedDays)
  );
  const filteredByCompany =
    companyFilter === "all"
      ? filteredByDate
      : mockData.filter((item) => item.empresa === companyFilter);
  const finalData =
    anomalyFilter === "all"
      ? companyFilter !== "all"
        ? filteredByCompany
        : filteredByDate
      : mockData.filter((item) =>
          anomalyFilter === "true" ? item.anomalia : !item.anomalia
        );

  // 📤 Export CSV
  const exportCSV = () => {
    const headers = [
      "ID",
      "Nome",
      "Data",
      "Empresa",
      "Colaborador",
      "Anomalia",
    ];
    const rows = finalData.map((r) => [
      r.id,
      r.nome,
      new Date(r.data).toLocaleDateString(),
      r.empresa,
      r.colaborador,
      r.anomalia ? "Sim" : "Não",
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          CheckList
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

      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "#1E2533", borderRadius: 2 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#6E7484" }}>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  <Box display="flex" alignItems="center">
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

                    {headCell.id === "data" && (
                      <>
                        <IconButton size="small" onClick={handleFilterClick}>
                          <FilterList sx={{ color: "white" }} />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleFilterClose}
                          PaperProps={{
                            sx: { bgcolor: "#2A3142", color: "white" },
                          }}
                        >
                          {dateOptions.map((opt) => (
                            <MenuItem
                              key={opt.value}
                              selected={dateFilter === opt.value}
                              onClick={() => handleSelectDateFilter(opt.value)}
                            >
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </>
                    )}

                    {headCell.id === "empresa" && (
                      <>
                        <IconButton
                          size="small"
                          onClick={handleCompanyFilterClick}
                        >
                          <FilterList sx={{ color: "white" }} />
                        </IconButton>
                        <Menu
                          anchorEl={companyAnchorEl}
                          open={Boolean(companyAnchorEl)}
                          onClose={handleCompanyFilterClose}
                          PaperProps={{
                            sx: { bgcolor: "#2A3142", color: "white" },
                          }}
                        >
                          <MenuItem
                            selected={companyFilter === "all"}
                            onClick={() => handleSelectCompanyFilter("all")}
                          >
                            Todas as empresas
                          </MenuItem>
                          {uniqueCompanies.map((empresa) => (
                            <MenuItem
                              key={empresa}
                              selected={companyFilter === empresa}
                              onClick={() => handleSelectCompanyFilter(empresa)}
                            >
                              {empresa}
                            </MenuItem>
                          ))}
                        </Menu>
                      </>
                    )}

                    {headCell.id === "anomalia" && (
                      <>
                        <IconButton
                          size="small"
                          onClick={handleAnomalyFilterClick}
                        >
                          <FilterList sx={{ color: "white" }} />
                        </IconButton>
                        <Menu
                          anchorEl={anomalyAnchorEl}
                          open={Boolean(anomalyAnchorEl)}
                          onClose={handleAnomalyFilterClose}
                          PaperProps={{
                            sx: { bgcolor: "#2A3142", color: "white" },
                          }}
                        >
                          {anomalyOptions.map((opt) => (
                            <MenuItem
                              key={opt.value}
                              selected={anomalyFilter === opt.value}
                              onClick={() =>
                                handleSelectAnomalyFilter(opt.value)
                              }
                            >
                              {opt.icon}
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {stableSort(finalData, getComparator(order, orderBy))
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
                  <TableCell sx={{ color: "white" }}>
                    {row.colaborador}
                  </TableCell>
                  <TableCell>
                    {row.anomalia ? (
                      <CheckCircle sx={{ color: "#2ECC71" }} />
                    ) : (
                      <Error sx={{ color: "#E74C3C" }} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={finalData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[14]}
          sx={{ color: "white", backgroundColor: "#1E2533" }}
        />
      </TableContainer>
    </Box>
  );
};

export default FormResponses;
