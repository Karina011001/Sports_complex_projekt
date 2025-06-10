import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Alert } from 'react-bootstrap';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import HallManagementPage from './pages/admin/HallManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import HallsPublicPage from './pages/HallsPublicPage';
import TrainersPublicPage from './pages/TrainersPublicPage';

import AuthContext from './context/AuthContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, handleLogout }}>
      <div className="d-flex flex-column min-vh-100"> 
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">Spordikompleks</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Kodu</Nav.Link>
                <Nav.Link as={Link} to="/halls-public">Saalid</Nav.Link>
                <Nav.Link as={Link} to="/trainers-public">Treenerid</Nav.Link>

                {currentUser && (
                  <Nav.Link as={Link} to="/profile">Profiil</Nav.Link>
                )}

                {currentUser && currentUser.roll === 'admin' && (
                  <>
                    <Nav.Link as={Link} to="/admin/halls">Saalide haldamine</Nav.Link>
                    <Nav.Link as={Link} to="/admin/users">Kasutajate haldamine</Nav.Link>
                  </>
                )}
              </Nav>
              <Nav>
                {currentUser ? (
                  <>
                    <Navbar.Text className="me-3">
                      Tere, {currentUser.eesnimi} ({currentUser.roll})
                    </Navbar.Text>
                    <Button variant="outline-light" onClick={handleLogout}>
                      Logi välja
                    </Button>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">Logi sisse</Nav.Link>
                    <Nav.Link as={Link} to="/register">Registreeru</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/profile" element={currentUser ? <Profile /> : <Login />} />

            <Route path="/halls-public" element={<HallsPublicPage />} />
            <Route path="/trainers-public" element={<TrainersPublicPage />} />

            <Route
              path="/admin/halls"
              element={
                currentUser && currentUser.roll === 'admin' ? (
                  <HallManagementPage />
                ) : (
                  <Container className="mt-5 text-center">
                    <Alert variant="danger">Ligipääs keelatud! Teil puuduvad administraatori õigused.</Alert>
                  </Container>
                )
              }
            />

            <Route
              path="/admin/users"
              element={
                currentUser && currentUser.roll === 'admin' ? (
                  <UserManagementPage />
                ) : (
                  <Container className="mt-5 text-center">
                    <Alert variant="danger">Ligipääs keelatud! Teil puuduvad administraatori õigused.</Alert>
                  </Container>
                )
              }
            />

            <Route path="/admin/dashboard" element={<Container className="mt-5 text-center">
              <Alert variant="info">
                Administraatori paneeli leht on eemaldatud. Kasutage navigeerimiseks "Saalide haldamine" või "Kasutajate haldamine".
              </Alert>
              {currentUser && currentUser.roll === 'admin' && (
                <Nav.Link as={Link} to="/admin/halls">Mine Saalide haldamisele</Nav.Link>
              )}
            </Container>} />
            
            <Route path="*" element={<Container className="mt-5 text-center"><h1>404 - Lehte ei leitud</h1><p>Sellist lehte ei eksisteeri.</p></Container>} />
          </Routes>
        </div>
        <footer className="bg-dark text-white text-center py-3 mt-auto"> 
          <Container>
            <p>&copy; {new Date().getFullYear()} Spordikompleks. Kõik õigused kaitstud.</p>
          </Container>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
