import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Card, Alert, Spinner, Row, Col } from "react-bootstrap";
import authService from "../services/auth.service";
import AuthContext from '../context/AuthContext'; 

const Register = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext); 

  const [formData, setFormData] = useState({
    eesnimi: "",
    perekonnanimi: "",
    telNr: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger");
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await authService.getAllRoles();
        setRoles(response.data);
        const defaultUserRole = response.data.find(r => r.Nimetus === 'kasutaja');
        if (defaultUserRole) {
          setSelectedRoleId(defaultUserRole.RollID);
        } else if (response.data.length > 0) {
          setSelectedRoleId(response.data[0].RollID);
        }
      } catch (error) {
        console.error('Error fetching roles:', error.response?.data || error.message);
        setMessage('Viga rollide laadimisel. Palun proovige hiljem uuesti.');
        setVariant('danger');
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await authService.signup(
        formData.eesnimi,
        formData.perekonnanimi,
        formData.telNr,
        formData.email,
        formData.password,
        selectedRoleId
      );
      const loginResponse = await authService.signin(formData.email, formData.password);
      setCurrentUser(loginResponse); 
    
      navigate('/profile'); 
      
      setMessage("Registreerimine ja sisselogimine õnnestus!");
      setVariant("success");
      
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
      setVariant("danger");
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
              Registreeru
            </Card.Header>
            <Card.Body>
              {message && <Alert variant={variant}>{message}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEesnimi">
                  <Form.Label>Eesnimi</Form.Label>
                  <Form.Control
                    type="text"
                    name="eesnimi"
                    value={formData.eesnimi}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPerekonnanimi">
                  <Form.Label>Perekonnanimi</Form.Label>
                  <Form.Control
                    type="text"
                    name="perekonnanimi"
                    value={formData.perekonnanimi}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTelNr">
                  <Form.Label>Telefoninumber</Form.Label>
                  <Form.Control
                    type="text"
                    name="telNr"
                    value={formData.telNr}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>E-post</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Salasõna</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRole">
                  <Form.Label>Roll</Form.Label>
                  <Form.Control
                    as="select"
                    name="RollID"
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    required
                  >
                    <option value="">Vali roll...</option>
                    {roles.map((role) => (
                      <option key={role.RollID} value={role.RollID}>
                        {role.Nimetus}
                      </option>
                    ))}
                  </Form.Control>
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
                  Registreeru
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
