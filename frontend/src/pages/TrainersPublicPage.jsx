import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Alert, Button, Modal, Form } from 'react-bootstrap';
import trainerService from '../services/trainer.service';
import bookingService from '../services/booking.service';
import ratingService from '../services/rating.service';
import authService from '../services/auth.service';

const TrainersPublicPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [generatedTimeSlots, setGeneratedTimeSlots] = useState([]);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingTrainerId, setRatingTrainerId] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [currentRatings, setCurrentRatings] = useState([]);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await trainerService.getAllTrainers();
      setTrainers(response.data);
      setMessage('');
      setVariant('');
    } catch (error) {
      console.error('Viga treenerite hankimisel:', error.response?.data || error.message);
      setMessage('Viga treenerite hankimisel: ' + (error.response?.data?.message || error.message));
      setVariant('danger');
    }
  };

  const generateTimeSlots = (date) => {
    const slots = [];
    if (!date) return slots;

    const startHour = 9;
    const endHour = 20;
    const sessionDuration = 90;
    const breakDuration = 10;

    let currentMoment = new Date(date);
    currentMoment.setHours(startHour, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(endHour, 0, 0, 0);

    while (currentMoment.getHours() < endHour || (currentMoment.getHours() === endHour && currentMoment.getMinutes() === 0)) {
        const slotStart = new Date(currentMoment);
        const slotEnd = new Date(slotStart.getTime() + sessionDuration * 60 * 1000);

        if (slotEnd.getHours() > endHour || (slotEnd.getHours() === endHour && slotEnd.getMinutes() > 0)) {
            break;
        }

        const formattedStartTime = `${String(slotStart.getHours()).padStart(2, '0')}:${String(slotStart.getMinutes()).padStart(2, '0')}`;
        const formattedEndTime = `${String(slotEnd.getHours()).padStart(2, '0')}:${String(slotEnd.getMinutes()).padStart(2, '0')}`;
        
        slots.push({
            time: formattedStartTime,
            display: `${formattedStartTime} - ${formattedEndTime}`
        });

        currentMoment.setTime(slotEnd.getTime() + breakDuration * 60 * 1000);
    }
    return slots;
  };

  const handleBookingClick = () => {
    if (!currentUser) {
      setMessage('Palun logi sisse, et broneerida treening!');
      setVariant('warning');
      return;
    }
    setSelectedTrainer(null);
    setSelectedDate('');
    setSelectedTime('');
    setBookingMessage('');
    setGeneratedTimeSlots([]);
    setShowBookingModal(true);
    console.log('Frontend: Booking modal opened.');
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const slots = generateTimeSlots(date);
    setGeneratedTimeSlots(slots);
    setSelectedTime('');
    console.log('Frontend: Date changed to', date, 'Generated slots:', slots);
  };

  const handleBookTraining = async (e) => {
    e.preventDefault();
    setBookingMessage('');
    console.log('Frontend: handleBookTraining initiated.');

    if (!selectedTrainer || !selectedDate || !selectedTime) {
      console.log('Frontend: Missing trainer, date, or time.');
      setBookingMessage('Palun vali treener, kuupäev ja kellaaeg!');
      setVariant('danger');
      return;
    }

    try {
        console.log('Frontend: Calling bookingService.createBooking with:', selectedTrainer.TreenerID, selectedDate, selectedTime);
        await bookingService.createBooking(
            selectedTrainer.TreenerID,
            null, 
            selectedDate,
            selectedTime
        );
        setBookingMessage('Treening edukalt broneeritud!');
        setVariant('success');
        setShowBookingModal(false);
        setMessage('Broneering edukalt loodud! Vaata oma profiili.');
        setVariant('success');
        console.log('Frontend: Booking successful, UI updated.');
    } catch (error) {
      console.error('Frontend: Error during booking:', error.response?.data || error.message);
      setBookingMessage('Viga treeningu broneerimisel: ' + (error.response?.data?.message || error.message));
      setVariant('danger');
      console.log('Frontend: Booking failed, UI updated with error.');
    }
  };

  const handleShowRatingModal = async (trainerId) => {
    if (!currentUser) {
        setMessage('Palun logi sisse, et jätta arvustus!');
        setVariant('warning');
        return;
    }
    setSelectedTrainer(trainers.find(t => t.TreenerID === trainerId));
    setRatingTrainerId(trainerId);
    setUserRating(0);
    setUserComment('');
    try {
        const response = await ratingService.getTrainerRatings(trainerId);
        setCurrentRatings(response.data);
    } catch (error) {
        console.error('Viga arvustuste hankimisel:', error);
        setMessage('Viga arvustuste hankimisel.');
        setVariant('danger');
    }
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    if (userRating === 0 || !userComment.trim()) {
      setMessage('Palun sisesta hinnang ja kommentaar!');
      setVariant('danger');
      return;
    }
    try {
      await ratingService.createRating(ratingTrainerId, userRating, userComment);
      setMessage('Arvustus edukalt lisatud!');
      setVariant('success');
      setShowRatingModal(false);
      fetchTrainers();
    } catch (error) {
      console.error('Viga arvustuse lisamisel:', error.response?.data || error.message);
      setMessage('Viga arvustuse lisamisel: ' + (error.response?.data?.message || error.message));
      setVariant('danger');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Meie Treenerid</h2>

      {message && <Alert variant={variant}>{message}</Alert>}

      {currentUser && (
        <Button variant="success" size="lg" className="mb-4 w-100" onClick={handleBookingClick}>
          Broneerida
        </Button>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {trainers.length > 0 ? (
          trainers.map((trainer) => (
            <Col key={trainer.TreenerID}>
              <Card className="h-100 shadow-sm rounded-3">
                <Card.Body>
                  <Card.Title className="text-success">{trainer.Eesnimi} {trainer.Perekonnanimi}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Kontakt: {trainer.Email}</Card.Subtitle>
                  <Card.Text>
                    {trainer.Info || 'Lisainfo puudub.'}
                  </Card.Text>
                  {trainer.Telefon && <Card.Text>Telefon: {trainer.Telefon}</Card.Text>}
                  
                  <div className="mb-2">
                    <strong>Hinnang:</strong> {trainer.averageRating} / 5.0 ({trainer.reviewCount} arvustust)
                  </div>

                  <div className="d-flex justify-content-end mt-3">
                    {currentUser && (
                        <Button variant="outline-info" size="sm" onClick={() => handleShowRatingModal(trainer.TreenerID)}>
                        Jäta arvustus
                        </Button>
                    )}
                  </div>
                </Card.Body>
                <Card.Footer className="bg-light text-end">
                  <small className="text-muted">Treeneri ID: {trainer.TreenerID}</small>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <Col><Alert variant="info" className="text-center">Treenerid ei leitud.</Alert></Col>
        )}
      </Row>

      {/* Модальное окно для бронирования */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Бронировать тренировку</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingMessage && <Alert variant={variant}>{bookingMessage}</Alert>}
            <Form onSubmit={handleBookTraining}>
              <Form.Group className="mb-3" controlId="bookingTrainer">
                <Form.Label>Vali treener:</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedTrainer ? selectedTrainer.TreenerID : ''}
                  onChange={(e) => {
                    const trainerId = parseInt(e.target.value);
                    const trainer = trainers.find(t => t.TreenerID === trainerId);
                    setSelectedTrainer(trainer);
                    setSelectedDate('');
                    setSelectedTime('');
                    setGeneratedTimeSlots([]);
                  }}
                  required
                >
                  <option value="">Vali treener...</option>
                  {trainers.map(trainer => (
                    <option key={trainer.TreenerID} value={trainer.TreenerID}>
                      {trainer.Eesnimi} {trainer.Perekonnanimi}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="bookingDate">
                <Form.Label>Vali kuupäev:</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  disabled={!selectedTrainer}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="bookingTime">
                <Form.Label>Vali kellaaeg:</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  disabled={!selectedDate || generatedTimeSlots.length === 0}
                  required
                >
                  <option value="">Vali kellaaeg...</option>
                  {generatedTimeSlots.length > 0 ? (
                    generatedTimeSlots.map(slot => (
                      <option key={slot.time} value={slot.time}>
                        {slot.display}
                      </option>
                    ))
                  ) : (
                    <option disabled>Kuupäeval pole aegu saadaval</option>
                  )}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100"
                disabled={!selectedTrainer || !selectedDate || !selectedTime}>
                Kinnita broneering
              </Button>
            </Form>
        </Modal.Body>
      </Modal>

      {/* Модальное окно для отзывов */}
      <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Jäta arvustus treenerile {selectedTrainer?.Eesnimi} {selectedTrainer?.Perekonnanimi}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <Alert variant={variant}>{message}</Alert>}
          <h6>Hinnang:</h6>
          <div className="mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{ cursor: 'pointer', fontSize: '24px', color: star <= userRating ? 'gold' : 'gray' }}
                onClick={() => setUserRating(star)}
              >
                &#9733;
              </span>
            ))}
          </div>
          <h6>Kommentaar:</h6>
          <Form.Control
            as="textarea"
            rows={3}
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="Jäta oma kommentaar siia..."
            className="mb-3"
          />
          <Button variant="primary" onClick={handleSubmitRating}>
            Esita arvustus
          </Button>

          {currentRatings.length > 0 && (
            <div className="mt-4">
              <h6>Kõik arvustused:</h6>
              {currentRatings.map(r => (
                <div key={r.HinnangudID} className="mb-2 p-2 border rounded">
                  <p className="mb-0"><strong>{r.Rating} / 5</strong> - {r.Kommentaar}</p>
                  <small className="text-muted">Autor: {r.user ? `${r.user.Eesnimi} ${r.user.Perekonnanimi}` : 'Anonüümne'} ({new Date(r.Kuupäev).toLocaleDateString()})</small>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TrainersPublicPage;