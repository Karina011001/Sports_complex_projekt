import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Alert, Modal, Spinner } from 'react-bootstrap';
import userService from '../../services/user.service';
import authService from '../../services/auth.service';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    KasutajaID: null,
    Eesnimi: '',
    Perekonnanimi: '',
    TelNr: '',
    email: '',
    Salasõna: '',
    RollID: ''
  });
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
      setMessage('');
      setVariant('');
    } catch (error) {
      console.error('Viga kasutajate hankimisel:', error.response?.data || error.message);
      setMessage('Viga kasutajate hankimisel: ' + (error.response?.data?.message || error.message));
      setVariant('danger');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await authService.getAllRoles();
      setRoles(response.data);
    } catch (error) {
      console.error('Viga rollide hankimisel:', error.response?.data || error.message);
      setRoles([
        { RollID: 1, Nimetus: 'admin' },
        { RollID: 2, Nimetus: 'treener' },
        { RollID: 3, Nimetus: 'kasutaja' },
      ]);
      setMessage('Viga rollide hankimisel. Kasutatakse vaikimisi rolle.');
      setVariant('warning');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setVariant('');

    try {
      const dataToSend = {
        Eesnimi: formData.Eesnimi,
        Perekonnanimi: formData.Perekonnanimi,
        TelNr: formData.TelNr,
        email: formData.email,
        RollID: parseInt(formData.RollID)
      };

      if (formData.Salasõna) {
        dataToSend.Salasõna = formData.Salasõna;
      }

      if (formData.KasutajaID) {
        await userService.updateUser(formData.KasutajaID, dataToSend);
        setMessage('Kasutaja edukalt uuendatud!');
        setVariant('success');
      } else {
        if (!formData.Salasõna) {
          setMessage('Viga: Uue kasutaja loomisel on parool kohustuslik.');
          setVariant('danger');
          return;
        }
        await userService.createUser(dataToSend);
        setMessage('Kasutaja edukalt loodud!');
        setVariant('success');
      }

      setFormData({
        KasutajaID: null, Eesnimi: '', Perekonnanimi: '', TelNr: '', email: '', Salasõna: '', RollID: ''
      });
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error("Viga kasutaja salvestamisel:", error.response?.data || error.message);
      setMessage('Viga kasutaja salvestamisel: ' + (error.response?.data?.message || error.message));
      setVariant('danger');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      KasutajaID: user.KasutajaID,
      Eesnimi: user.Eesnimi || '',
      Perekonnanimi: user.Perekonnanimi || '',
      TelNr: user.TelNr || '',
      email: user.Email || '',
      Salasõna: '',
      RollID: user.role?.RollID || ''
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await userService.deleteUser(userToDelete);
      setMessage('Kasutaja edukalt kustutatud!');
      setVariant('success');
      fetchUsers();
    } catch (error) {
      console.error("Viga kasutaja kustutamisel:", error.response?.data || error.message);
      setMessage('Viga kasutaja kustutamisel: ' + (error.response?.data?.message || error.message));
      setVariant('danger');
    } finally {
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      KasutajaID: null, Eesnimi: '', Perekonnanimi: '', TelNr: '', email: '', Salasõna: '', RollID: ''
    });
    setMessage('');
    setVariant('');
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Kasutajate haldamine</h2>

      {message && <Alert variant={variant}>{message}</Alert>}

      <Button variant="primary" onClick={() => {
        setFormData({
          KasutajaID: null, Eesnimi: '', Perekonnanimi: '', TelNr: '', email: '', Salasõna: '', RollID: ''
        });
        setShowModal(true);
      }} className="mb-3">
        Lisa uus kasutaja
      </Button>

      {loadingUsers ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Laadimine...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Eesnimi</th>
              <th>Perekonnanimi</th>
              <th>Tel. nr</th>
              <th>E-post</th>
              <th>Roll</th>
              <th>Tegevused</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.KasutajaID}>
                  <td>{user.KasutajaID}</td>
                  <td>{user.Eesnimi}</td>
                  <td>{user.Perekonnanimi}</td>
                  <td>{user.TelNr}</td>
                  <td>{user.Email}</td>
                  <td>{user.role ? user.role.Nimetus : 'N/A'}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(user)}>
                      Muuda
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteClick(user.KasutajaID)}>
                      Kustuta
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">Kasutajaid ei leitud.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.KasutajaID ? 'Muuda kasutajat' : 'Lisa uus kasutaja'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEesnimi">
              <Form.Label>Eesnimi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sisesta eesnimi"
                name="Eesnimi"
                value={formData.Eesnimi}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPerekonnanimi">
              <Form.Label>Perekonnanimi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sisesta perekonnanimi"
                name="Perekonnanimi"
                value={formData.Perekonnanimi}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTelNr">
              <Form.Label>Telefoninumber</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sisesta telefoninumber"
                name="TelNr"
                value={formData.TelNr}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>E-post</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sisesta e-posti aadress"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSalasõna">
              <Form.Label>Salasõna {formData.KasutajaID && '(Jäta tühjaks, kui ei soovi muuta)'}</Form.Label>
              <Form.Control
                type="password"
                placeholder="Sisesta salasõna"
                name="Salasõna"
                value={formData.Salasõna}
                onChange={handleChange}
                {...(!formData.KasutajaID && { required: true })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRoll">
              <Form.Label>Roll</Form.Label>
              <Form.Control
                as="select"
                name="RollID"
                value={formData.RollID}
                onChange={handleChange}
                required
              >
                <option value="">Vali roll...</option>
                {roles.map(role => (
                  <option key={role.RollID} value={role.RollID}>
                    {role.Nimetus}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                {formData.KasutajaID ? 'Uuenda kasutajat' : 'Lisa kasutaja'}
              </Button>
              <Button variant="secondary" onClick={handleCloseModal}>
                Tühista
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Kustuta kasutaja</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Olete kindel, et soovite selle kasutaja kustutada? See tegevus on pöördumatu.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Tühista
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Kustuta
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagementPage;
