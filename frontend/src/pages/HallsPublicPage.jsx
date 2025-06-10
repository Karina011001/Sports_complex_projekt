import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Alert, Button, Modal, Form, Spinner } from 'react-bootstrap';
import hallService from '../services/hall.service';
import bookingService from '../services/booking.service';
import authService from '../services/auth.service';

const HallsPublicPage = () => {
  const [halls, setHalls] = useState([]);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const response = await hallService.getAllHallsPublic();
      setHalls(response.data);
      setMessage('');
      setVariant('');
    } catch (error) {
      console.error('Viga saalide hankimisel:', error.response?.data || error.message);
      setMessage('Viga saalide hankimisel: ' + (error.response?.data?.message || error.message));
      setVariant('danger');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = (hall) => {
    if (!currentUser) {
      setMessage('Palun logi sisse, et broneerida saal!');
      setVariant('warning');
      return;
    }
    setSelectedHall(hall);
    setBookingDate('');
    setBookingMessage('');
    setShowBookingModal(true);
  };

  const handleBookHall = async (e) => {
    e.preventDefault();
    setBookingMessage('');

    if (!selectedHall || !bookingDate) {
      setBookingMessage('Palun vali kuupäev!');
      setVariant('danger');
      return;
    }

    try {
      await bookingService.createBooking(
        null,
        selectedHall.SaaliID,
        bookingDate,
        null
      );
      setBookingMessage('Saal edukalt broneeritud!');
      setVariant('success');
      setShowBookingModal(false);
      setMessage('Broneering edukalt loodud! Vaata oma profiili.');
      setVariant('success');
    } catch (error) {
      console.error('Viga saali broneerimisel:', error.response?.data || error.message);
      setBookingMessage('Viga saali broneerimisel: ' + (error.response?.data?.message || error.message));
      setVariant('danger');
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Laadimine...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Meie Saalid</h2>

      {message && <Alert variant={variant}>{message}</Alert>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {halls.length > 0 ? (
          halls.map((hall) => (
            <Col key={hall.SaaliID}>
              <Card className="h-100 shadow-sm rounded-3">
                <Card.Img
                  variant="top"
                  src={hall.Pilt || ''} 
                  alt={`${hall.Nimetus} pilt`}
                  style={{ objectFit: 'cover', height: '200px' }} 
                  onError={(e) => { e.target.onerror = null; e.target.src = "error"; }} 
                />
                <Card.Body>
                  <Card.Title className="text-primary">{hall.Nimetus}</Card.Title>
                  <Card.Text>
                    {hall.Kirjeldus || 'Kirjeldus puudub.'}
                  </Card.Text>
                  <Card.Text>
                    <strong>Mahutavus:</strong> {hall.Mahtuvus} inimest
                  </Card.Text>
                  <Card.Text>
                    <strong>Hind tunnis:</strong> {parseFloat(hall.tunniHind).toFixed(2)}€
                  </Card.Text>
                  {currentUser && (
                    <Button variant="success" onClick={() => handleBookingClick(hall)}>
                      Broneeri saal
                    </Button>
                  )}
                </Card.Body>
                <Card.Footer className="bg-light text-end">
                  <small className="text-muted">Saali ID: {hall.SaaliID}</small>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center">Saale ei leitud.</td>
          </tr>
        )}
      </Row>

      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Broneeri saal: {selectedHall?.Nimetus}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingMessage && <Alert variant={variant}>{bookingMessage}</Alert>}
          <Form onSubmit={handleBookHall}>
            <Form.Group className="mb-3" controlId="bookingDate">
              <Form.Label>Kuupäev:</Form.Label>
              <Form.Control
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Kinnita broneering
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default HallsPublicPage;
