/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  ApartmentOutlined,
  HelpOutlineOutlined,
  ChecklistOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  ReceiptOutlined,
  TimelineOutlined,
  WavesOutlined,
  DonutLargeOutlined,
} from "@mui/icons-material";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import avatar from "../../../assets/images/fabio-vivas.jpeg";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import logo from "../../../assets/images/logo-cliente.jpeg";
import Item from "./Item";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { ToggledContext } from "../../../App";
import { useAuth } from "../../../contexts/AuthContext";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { auth, dataAuth } = useAuth();

  const userRole = dataAuth?.user?.role;

  let menuItems = [];
  if (userRole === "superAdmin") {
    menuItems = [
      {
        title: "Gerenciar Categorias",
        path: "/category",
        icon: <CheckOutlinedIcon />,
      },
      {
        title: "Gerenciar CheckList",
        path: "/checklists",
        icon: <ChecklistOutlined />,
      },
      {
        title: "Gerenciar empresa",
        path: "/company",
        icon: <ApartmentOutlined />,
      },
      {
        title: "Gerenciar funcionários",
        path: "/employees",
        icon: <BadgeOutlinedIcon />,
      },
      {
        title: "Gerenciar Respostas",
        path: "/formresponse",
        icon: <ManageSearchOutlinedIcon />,
      },
     /*  { title: "Gerenciar equipe", path: "/team", icon: <PeopleAltOutlined /> },
      {
        title: "Criar usuário",
        path: "/createEmployee",
        icon: <PersonOutlined />,
      }, */
    ];
  } else if (userRole === "Admin") {
    menuItems = [
      {
        title: "Gerenciar Respostas",
        path: "/formresponse",
        icon: <ManageSearchOutlinedIcon />,
      },
      { title: "Gerenciar equipe", path: "/team", icon: <PeopleAltOutlined /> },
    ];
  } else if (userRole === "User") {
    menuItems = [];
  }

  return (
    <>
      <Sidebar
        backgroundColor={colors.primary[400]}
        rootStyles={{
          border: 0,
          height: "100%",
        }}
        collapsed={collapsed}
        onBackdropClick={() => setToggled(false)}
        toggled={toggled}
        breakPoint="md"
      >
        <Menu
          menuItemStyles={{
            button: { ":hover": { background: "transparent" } },
          }}
        >
          <MenuItem
            rootStyles={{
              margin: "10px 0 20px 0",
              color: colors.gray[100],
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {!collapsed && (
                <Box
                  display="flex"
                  alignItems="center"
                  gap="12px"
                  sx={{ transition: ".3s ease" }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    textTransform="capitalize"
                    color={colors.greenAccent[500]}
                  >
                    Indicador Online
                  </Typography>
                </Box>
              )}
              <IconButton onClick={() => setCollapsed(!collapsed)}>
                <MenuOutlined />
              </IconButton>
            </Box>
          </MenuItem>
        </Menu>

        {!collapsed && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              mb: "25px",
            }}
          >
            <Avatar
              alt="avatar"
              src={logo}
              sx={{ width: "100px", height: "100px" }}
            />
          </Box>
        )}

        <Box mb={5} pl={collapsed ? undefined : "5%"}>
          {menuItems.length > 0 ? (
            <Menu
              menuItemStyles={{
                button: {
                  ":hover": {
                    color: "#868dfb",
                    background: "transparent",
                    transition: ".4s ease",
                  },
                },
              }}
            >
              <Typography
                variant="h6"
                color={colors.gray[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                {!collapsed ? "Serviços disponíveis:" : " "}
              </Typography>
              {menuItems.map((item, index) => (
                <Item
                  key={index}
                  title={item.title}
                  path={item.path}
                  colors={colors}
                  icon={item.icon}
                />
              ))}
            </Menu>
          ) : (
            <Typography
              variant="h6"
              sx={{ m: "15px 0 5px 20px", color: colors.gray[300] }}
            >
              Você não tem permissão para visualizar itens.
            </Typography>
          )}
        </Box>
      </Sidebar>
      {/*    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ":hover": { background: "transparent" } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                  <img
                  style={{ width: "35px", height: "35px", borderRadius: "8px" }}
                  src={logo}
                  alt="Argon"
                /> 
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                >
                  Indicador Online
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>
      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
          <Avatar
            alt="avatar"
            src={logo}
            sx={{ width: "100px", height: "100px" }}
          />
             <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              Fabio
            </Typography>
            <Typography
              variant="h6"
              fontWeight="500"
              color={colors.greenAccent[500]}
            >
              Admin
            </Typography>
          </Box> 
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Dashboard"
            path="/"
            colors={colors}
            icon={<DashboardOutlined />}
          />
        </Menu>  
         <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Data" : " "}
        </Typography>{" "} 
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Gerenciar Categorias"
            path="/category"
            colors={colors}
            icon={<CheckOutlinedIcon />}
          />
          <Item
            title="Gerenciar CheckList"
            path="/checklists"
            colors={colors}
            icon={<ChecklistOutlined />}
          />
          <Item
            title="Gerenciar empresa"
            path="/company"
            colors={colors}
            icon={<ApartmentOutlined />}
          />
          <Item
            title="Gerenciar funcionários"
            path="/employees"
            colors={colors}
            icon={<BadgeOutlinedIcon />}
          />
          <Item
            title="Gerenciar Respostas"
            path="/formresponse"
            colors={colors}
            icon={<ManageSearchOutlinedIcon />}
          />
          <Item
            title="Gerenciar equipe"
            path="/team"
            colors={colors}
            icon={<PeopleAltOutlined />}
          />

          <Item
            title="Criar usuário"
            path="/createEmployee"
            colors={colors}
            icon={<PersonOutlined />}
          />
          <Item
            title="Contacts Information"
            path="/contacts"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Invoices Balances"
            path="/invoices"
            colors={colors}
            icon={<ReceiptOutlined />}
          /> 
        </Menu>
          <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Pages" : " "}
        </Typography> 
           <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Criar usuário"
            path="/form"
            colors={colors}
            icon={<PersonOutlined />}
          />
          <Item
            title="Calendar"
            path="/calendar"
            colors={colors}
            icon={<CalendarTodayOutlined />}
          /> 
           <Item
            title="FAQ Page"
            path="/faq"
            colors={colors}
            icon={<HelpOutlineOutlined />}
          /> 
        </Menu> 
         <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Analytics" : " "}
        </Typography> 
          <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Bar Chart"
            path="/bar"
            colors={colors}
            icon={<BarChartOutlined />}
          />
          <Item
            title="Pie Chart"
            path="/pie"
            colors={colors}
            icon={<DonutLargeOutlined />}
          />
          <Item
            title="Line Chart"
            path="/line"
            colors={colors}
            icon={<TimelineOutlined />}
          />
          <Item
            title="Geography Chart"
            path="/geography"
            colors={colors}
            icon={<MapOutlined />}
          />
          <Item
            title="Stream Chart"
            path="/stream"
            colors={colors}
            icon={<WavesOutlined />}
          />
        </Menu>   
      </Box>
    </Sidebar> */}
    </>
  );
};

export default SideBar;
