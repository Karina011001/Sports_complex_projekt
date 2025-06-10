import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import authService from '../services/auth.service';
import AuthContext from '../context/AuthContext'; 

const Login = () => { 
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext); 

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('danger');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setVariant('danger');

    try {
      const response = await authService.signin(formData.email, formData.password);
      
      setCurrentUser(response); 
      navigate('/profile'); 
      
      setMessage('Sisselogimine õnnestus!'); 
      setVariant('success');
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
      setVariant('danger');
      console.error("Viga sisselogimisel:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm rounded-3">
            <Card.Header as="h3" className="text-center bg-primary text-white">
              Logi sisse
            </Card.Header>
            <Card.Body>
              {message && <Alert variant={variant}>{message}</Alert>}
              <Form onSubmit={handleSubmit} className="p-4">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>E-post</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Sisesta e-posti aadress"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Salasõna</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Sisesta salasõna"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                  )}
                  Logi sisse
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
