import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  CreateEmployee,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
} from "./scenes";
import Checklist from "./scenes/checklist";
import Company from "./scenes/company";
import CreateCompany from "./scenes/company/create-company";
import Login from "./scenes/login";
import ChecklistForm from "./scenes/checklist/create-checklist";
import ChecklistList from "./scenes/checklist";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import FormResponses from "./scenes/formResponse/index.jsx";
import Employees from "./scenes/employees/index.jsx";
import CreateEmployees from "./scenes/employees/create-employees.jsx";
import Category from "./scenes/categories/index.jsx";
import CreateCategory from "./scenes/categories/create-category.jsx";
import SettingsChecklist from "./scenes/checklist/settings-checklist.jsx";
import ChecklistDetail from "./scenes/checklistDetails/index.jsx";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

     <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="/team" element={<Team />} />

          <Route path="/create-category" element={<CreateCategory />} />
          <Route path="/category" element={<Category />} />

          <Route path="/create-company" element={<CreateCompany />} />
          <Route path="/company" element={<Company />} />

          <Route path="/create-employees" element={<CreateEmployees />} />
          <Route path="/employees" element={<Employees />} />

          <Route path="/checklists" element={<ChecklistList />} />
          <Route path="/checklists/:id/settings" element={<SettingsChecklist />} />
          <Route path="/formresponse" element={<FormResponses />} />
          <Route path="/checklistform" element={<ChecklistForm />} />
          <Route path="/checklist/:id" element={<ChecklistDetail />} />

          <Route path="/contacts" element={<Contacts />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/createEmployee" element={<CreateEmployee />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/bar" element={<Bar />} />
          <Route path="/pie" element={<Pie />} />
          <Route path="/stream" element={<Stream />} />
          <Route path="/line" element={<Line />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/geography" element={<Geography />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
