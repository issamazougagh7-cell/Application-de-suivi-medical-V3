import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import AddPatient from "../pages/AddPatient";
import EditPatient from "../pages/EditPatient";
import Appointments from "../pages/Appointments";
import AddAppointment from "../pages/AddAppointment";
import Prescriptions from "../pages/Prescriptions";
import FindDoctor from "../pages/FindDoctor";
import Connections from "../pages/Connections";
import Chat from "../pages/Chat";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/add" element={<AddPatient />} />
            <Route path="/patients/edit/:id" element={<EditPatient />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointments/add" element={<AddAppointment />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/find-doctor" element={<FindDoctor />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:userId" element={<Chat />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
