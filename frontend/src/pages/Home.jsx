import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Home = () => {
  return (
    <Container className="mt-5 mb-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">Tere tulemast Spordikompleksi!</h1>
        <p className="lead text-muted">
          Koht, kus vormi hoida ja uusi treeningvõimalusi avastada.
          Pakume laia valikut saale, professionaalseid treenereid ja mitmekesiseid treeninguid igale tasemele.
        </p>
      </div>

      <Row className="mb-5 text-center">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0 rounded-3">
            <Card.Body>
              <i className="fas fa-dumbbell fa-3x text-success mb-3"></i> 
              <Card.Title className="text-success">Kaasaegsed saalid</Card.Title>
              <Card.Text>
                Meie avarad ja hästi varustatud saalid ootavad sind.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0 rounded-3">
            <Card.Body>
              <i className="fas fa-user-friends fa-3x text-info mb-3"></i> 
              <Card.Title className="text-info">Professionaalsed treenerid</Card.Title>
              <Card.Text>
                Kogenud treenerid aitavad sul saavutada oma eesmärgid.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0 rounded-3">
            <Card.Body>
              <i className="fas fa-calendar-alt fa-3x text-warning mb-3"></i>
              <Card.Title className="text-warning">Paindlik ajakava</Card.Title>
              <Card.Text>
                Leia endale sobiv treening meie laia ajakava hulgast.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="text-center mb-4 text-secondary">Kontaktandmed</h2>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body className="p-4">
              <p className="mb-2">
                <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                <strong>Aadress:</strong> Spordi tee 10, Tallinn, Eesti
              </p>
              <p className="mb-2">
                <i className="fas fa-phone me-2 text-primary"></i>
                <strong>Telefon:</strong> +372 555 1234
              </p>
              <p className="mb-2">
                <i className="fas fa-envelope me-2 text-primary"></i>
                <strong>E-post:</strong> info@spordikompleks.ee
              </p>
              <p className="mb-0">
                <i className="fas fa-clock me-2 text-primary"></i>
                <strong>Lahtiolekuajad:</strong> E-R 07:00-22:00, L-P 09:00-20:00
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <h2 className="text-center mb-4 mt-5 text-secondary">Leiame meid kaardilt</h2>
      <div className="map-container mb-5 rounded-3 shadow-sm overflow-hidden" style={{ height: '450px', width: '100%' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2028.988296317282!2d24.7535794!3d59.436961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465357c6b5b5c92f%3A0x67c2e0e0e0e0e0e0!2sTallinn%2C%20Estonia!5e0!3m2!1sen!2see!4v1678912345678!5m2!1sen!2see"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Spordikompleksi asukoht"
        ></iframe>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" xintegrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvzMdzzQ+IghFQQVn/kYh2x0gA2w==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
    </Container>
  );
};

export default Home;
