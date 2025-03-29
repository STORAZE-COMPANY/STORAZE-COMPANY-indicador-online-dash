import { Box, Select, MenuItem, InputLabel } from "@mui/material";


export function SelectCompanySection({
  companies,
  companyId,
  onChange
}) {


  return (
    <Box sx={{ gridColumn: "span 4" }}>
      <InputLabel id="demo-simple-select-standard-label">Empresa</InputLabel>
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        fullWidth
        value={companyId}
        variant="filled"
        onChange={onChange}
      >
        {companies?.map((company, index) => (
          <MenuItem key={index} value={company.id}>{company.name}</MenuItem>
        ))}

      </Select >
    </Box>

  );
};


