import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import ChatBot from "./components/ChatBot";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Admin from "./pages/Admin";
import MyOrders from "./pages/MyOrders";

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";
  const hideNavbar = location.pathname.startsWith("/menu") || isAdminPage;

  return (
    
    <div style={{ minHeight: "100vh", color: "white" }}>
      <ScrollProgress />
      {!hideNavbar && <Navbar />}
      

      <div key={location.pathname} className="page-fade">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/menu/:category" element={<Category />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/orders" element={<MyOrders />} />
        </Routes>
      </div>
      

      {!isAdminPage && <ChatBot />}
    </div>
  );
}

export default App;