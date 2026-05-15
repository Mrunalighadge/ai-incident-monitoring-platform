import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import PaymentMonitoring from "./pages/PaymentMonitoring";
import DatabaseMonitoring from "./pages/DatabaseMonitoring";
import NotificationMonitoring from "./pages/NotificationMonitoring";
import AuthMonitoring from "./pages/AuthMonitoring";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/payment-monitoring"
          element={<PaymentMonitoring />}
        />

        <Route
          path="/database-monitoring"
          element={<DatabaseMonitoring />}
        />

        <Route
          path="/notification-monitoring"
          element={<NotificationMonitoring />}
        />

        <Route
          path="/auth-monitoring"
          element={<AuthMonitoring />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;