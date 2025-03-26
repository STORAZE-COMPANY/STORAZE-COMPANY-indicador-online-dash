import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
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
          <Route path="/create-company" element={<CreateCompany />} />
          <Route path="/company" element={<Company />} />

          <Route path="/checklists" element={<ChecklistList />} />
          <Route path="/checklistform" element={<ChecklistForm />} />

          <Route path="/contacts" element={<Contacts />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/form" element={<Form />} />
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
