import { Routes, Route, useLocation, NavLink } from "react-router-dom";
import Login from "./pages/login/login";
import Registration from "./pages/registration/registration";
import Header from "./atoms/Header";
import { Layout } from "./HOC/Layout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Col, Row } from "react-bootstrap";
import { Icons } from "./atoms/Icons";
import { jwtDecode } from "jwt-decode";
import PortfolioTracker from "./molecules/PortfolioTacker";
import Dashboard from "./pages/dashboard/dashboard";
// import Buttons from "./atoms/Buttons";

function App() {
  const location = useLocation();

  // Login & Register pages where Header should NOT show
  const hideHeaderRoutes = ["/", "/login", "/register"];

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  const token = localStorage.getItem("token");

  let profilePic = null;
  let username = null;

  if (token) {
    const decoded = jwtDecode(token);
    profilePic = decoded.picture;
    username = decoded.name;
    console.log("profilePic ", profilePic);
  }

  const handleLogout = (e) => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  return (
    <>
      <Layout>
        <div className="main-container">
          {/* Show Header only when NOT on login/register */}
          {!shouldHideHeader && (
            <>
              <div className="navigation-header">
                <Header />
              </div>
              <Row style={{ paddingTop: "20px" }}>
                <Col md={6}></Col>

                <Col md={6} className="d-none d-sm-block">
                  <div className="user-actions">
                    <div className="profile-wrapper">
                      {profilePic ? (
                        <img src={profilePic} className="profile-pic" alt="profile" />
                      ) : (
                        <div className="profile-placeholder">
                          {username ? username.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                    </div>
                    <span className="user-name">{username}</span>
                    <NavLink
                      onClick={handleLogout}
                      to="/login"
                      className="logout-button"
                    >
                      <Icons iconname="logout-round" variant="logo" />
                    </NavLink>
                    {/* <Buttons className="three-d-btn"/> */}
                  </div>
                </Col>
              </Row>
            </>
          )}
          <div className="page-content">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/portfolio" element={<PortfolioTracker />} />
              </Routes>
            </GoogleOAuthProvider>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default App;