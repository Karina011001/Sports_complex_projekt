import api from './api'; 

const BOOKING_API_BASE_URL = '/api/bookings'; 
const USER_BOOKINGS_API_URL = '/api/users/me/bookings'; 

class BookingService {
  createBooking(trennId, saaliId, bookingDate, bookingTime) {
    return api.post(BOOKING_API_BASE_URL, {
      trennId: trennId,    
      SaaliID: saaliId,    
      bookingDate: bookingDate,
      bookingTime: bookingTime 
    });
  }
  getUserBookings() {
    return api.get(USER_BOOKINGS_API_URL);
  }
  cancelBooking(bookingId) {
    return api.delete(`${BOOKING_API_BASE_URL}/${bookingId}`);
  }
}

export default new BookingService();