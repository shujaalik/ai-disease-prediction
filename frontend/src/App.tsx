import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Landing } from "@/pages/Landing";

import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Dashboard } from "@/pages/Dashboard";

import { DashboardLayout } from "@/layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<div className="p-8">History Page (Coming Soon)</div>} />
          <Route path="/settings" element={<div className="p-8">Settings Page (Coming Soon)</div>} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
