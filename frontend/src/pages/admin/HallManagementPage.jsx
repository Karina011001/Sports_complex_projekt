import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import hallService from '../../services/hall.service';

const HallManagementPage = () => {
  const [halls, setHalls] = useState([]);
  const [formData, setFormData] = useState({
    SaaliID: null,
    Nimetus: '',
    Kirjeldus: '',
    Mahtuvus: '',
    tunniHind: '',
    Pilt: '',
  });
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hallToDelete, setHallToDelete] = useState(null);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const response = await hallService.getAllHalls();
      setHalls(response.data);
      setMessage('');
      setVariant('');
    } catch (error) {
      console.error('Viga saalide hankimisel:', error.response?.data || error.message);
      setMessage('Viga saalide hankimisel: ' + (error.response?.data?.message || error.message));
      setVariant('danger');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'Mahtuvus' || name === 'tunniHind') && value !== '' && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setVariant('');

    try {
      const dataToSend = {
        Nimetus: formData.Nimetus,
        Kirjeldus: formData.Kirjeldus,
        Mahtuvus: formData.Mahtuvus,
        tunniHind: formData.tunniHind,
        Pilt: formData.Pilt,
      };

      if (formData.SaaliID) {
        await hallService.updateHall(formData.SaaliID, dataToSend);
        setMessage('Saal edukalt uuendatud!');
        setVariant('success');
      } else {
        await hallService.createHall(dataToSend);
        setMessage('Saal edukalt lisatud!');
        setVariant('success');
      }

      setFormData({
        SaaliID: null,
        Nimetus: '',
        Kirjeldus: '',
        Mahtuvus: '',
        tunniHind: '',
        Pilt: '',
      });
      fetchHalls();
      setShowModal(false);
    } catch (error) {
      console.error("Viga saali salvestamisel:", error.response?.data || error.message);
      setMessage('Viga saali salvestamisel: ' + (error.response?.data?.message || error.message));
      setVariant('danger');
    }
  };

  const handleEdit = (hall) => {
    setFormData({
      SaaliID: hall.SaaliID,
      Nimetus: hall.Nimetus || '',
      Kirjeldus: hall.Kirjeldus || '',
      Mahutavus: hall.Mahtuvus !== undefined && hall.Mahtuvus !== null ? String(hall.Mahtuvus) : '',
      tunniHind: hall.tunniHind !== undefined && hall.tunniHind !== null ? parseFloat(hall.tunniHind).toFixed(2) : '',
      Pilt: hall.Pilt || '',
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setHallToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await hallService.deleteHall(hallToDelete);
      setMessage('Saal edukalt kustutatud!');
      setVariant('success');
      fetchHalls();
    } catch (error) {
      console.error("Viga saali kustutamisel:", error.response?.data || error.message);
      setMessage('Viga saali kustutamisel: ' + (error.response?.data?.message || error.message));
      setVariant('danger');
    } finally {
      setShowConfirmModal(false);
      setHallToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setHallToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      SaaliID: null,
      Nimetus: '',
      Kirjeldus: '',
      Mahtuvus: '',
      tunniHind: '',
      Pilt: '',
    });
    setMessage('');
    setVariant('');
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Saalide haldamine</h2>

      {message && <Alert variant={variant}>{message}</Alert>}

      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
        Lisa uus saal
      </Button>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nimi</th>
            <th>Kirjeldus</th>
            <th>Mahtuvus</th>
            <th>Hind tunnis (€)</th>
            <th>Pilt</th>
            <th>Tegevused</th>
          </tr>
        </thead>
        <tbody>
          {halls.length > 0 ? (
            halls.map((hall) => (
              <tr key={hall.SaaliID}>
                <td>{hall.SaaliID}</td>
                <td>{hall.Nimetus}</td>
                <td>{hall.Kirjeldus}</td>
                <td>{hall.Mahtuvus}</td>
                <td>{hall.tunniHind !== null && hall.tunniHind !== undefined ? parseFloat(hall.tunniHind).toFixed(2) : 'N/A'}</td>
                <td>
                  {hall.Pilt ? (
                    <a href={hall.Pilt} target="_blank" rel="noopener noreferrer">
                      <img
                        src={hall.Pilt}
                        alt={hall.Nimetus}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/50x50/cccccc/000000?text=N/A"; }}
                      />
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(hall)}>
                    Muuda
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteClick(hall.SaaliID)}>
                    Kustuta
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">Saale ei leitud.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.SaaliID ? 'Muuda saali' : 'Lisa uus saal'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formNimetus">
              <Form.Label>Nimi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sisesta saali nimi"
                name="Nimetus"
                value={formData.Nimetus}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formKirjeldus">
              <Form.Label>Kirjeldus</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Sisesta saali kirjeldus"
                name="Kirjeldus"
                value={formData.Kirjeldus}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMahtuvus">
              <Form.Label>Mahtuvus</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sisesta saali mahutavus"
                name="Mahtuvus"
                value={formData.Mahtuvus}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formtunniHind">
              <Form.Label>Hind tunnis (€)</Form.Label>
              <Form.Control
                type="text"
                step="0.01"
                placeholder="Sisesta hind tunnis"
                name="tunniHind"
                value={formData.tunniHind}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPilt">
              <Form.Label>Pilt URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sisesta pildi URL (nt. https://example.com/saal.jpg)"
                name="Pilt"
                value={formData.Pilt}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                {formData.SaaliID ? 'Uuenda saali' : 'Lisa saal'}
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
          <Modal.Title>Kustuta saal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Olete kindel, et soovite selle saali kustutada? See tegevus on pöördumatu.
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

export default HallManagementPage;
