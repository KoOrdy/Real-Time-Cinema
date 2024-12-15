import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosInstance';
import Navbar from './navbar';
import './mybooking.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get('/customer/myBookings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Filter out bookings with "Cancelled" status
      const validBookings = response.data.data.filter(
        (booking) => booking.status !== 'Cancelled'
      );
      setBookings(validBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchBookings(); // Initial fetch

    const interval = setInterval(() => {
      fetchBookings(); // Refresh every 10 seconds
    }, 10000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Handle cancel button click
  const handleCancelClick = (id) => {
    setCurrentBookingId(id);
    setShowModal(true);
  };

  // Confirm cancel
  const confirmCancel = async () => {
    try {
      await axiosInstance.patch(
        `customer/bookingId/${currentBookingId}/cancelBooking`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update bookings to remove cancelled booking
      setBookings((prev) =>
        prev.filter((booking) => booking.bookingNumber !== currentBookingId)
      );
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel the booking. Please try again later.');
    } finally {
      setShowModal(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <p>Loading your bookings...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Navbar />
      <div className="my-bookings">
        <h2>My Bookings</h2>
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div
              key={booking.bookingNumber}
              className={`booking-card ${booking.status.toLowerCase()}`}
            >
              <p><b>Booking Number:</b> {booking.bookingNumber}</p>
              <p><b>Cinema:</b> {booking.cinemaName}</p>
              <p><b>Hall:</b> {booking.hallName}</p>
              <p><b>Movie:</b> {booking.movieName}</p>
              <p><b>Date:</b> {booking.bookingDate}</p>
              <p><b>Start Time:</b> {booking.startShowTime}</p>
              <p><b>End Time:</b> {booking.endShowTime}</p>
              <p><b>Status:</b> {booking.status}</p>
              {booking.status !== 'Cancelled' && (
                <button
                  className="cancel-button"
                  onClick={() => handleCancelClick(booking.bookingNumber)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Are you sure you want to cancel this booking?</p>
              <button className="confirm-button" onClick={confirmCancel}>
                Yes
              </button>
              <button className="close-button" onClick={closeModal}>
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookings;
