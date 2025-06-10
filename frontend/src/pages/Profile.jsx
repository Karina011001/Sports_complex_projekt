import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import AuthContext from '../context/AuthContext'; 

const Profile = () => {
  const { currentUser, handleLogout } = useContext(AuthContext); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return (
      <Container className="mt-5 text-center">
        <p>Profiili laadimine või ümbersuunamine...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm rounded-3">
            <Card.Header as="h3" className="text-center bg-primary text-white">
              Kasutaja profiil
            </Card.Header>
            <Card.Body>
              <h4 className="mb-4">Tere tulemast, {currentUser.eesnimi}!</h4>
              <div className="mb-3">
                <strong>Eesnimi:</strong> {currentUser.eesnimi}
              </div>
              <div className="mb-3">
                <strong>Perekonnanimi:</strong> {currentUser.perekonnanimi}
              </div>
              <div className="mb-3">
                <strong>E-post:</strong> {currentUser.email}
              </div>
              <div className="mb-3">
                <strong>Telefon:</strong> {currentUser.telNr || 'Määramata'}
              </div>
              <div className="mb-4">
                <strong>Roll:</strong> {currentUser.roll}
              </div>
              <Button variant="danger" onClick={handleLogout} className="w-100">
                Logi välja
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
