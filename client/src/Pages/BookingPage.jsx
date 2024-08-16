import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AddressLink from "../components/AddressLink";
import BookingDates from "../components/BookingDates";
import PlaceGallery from "../components/PlaceGallery";

const BookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get("/api/auth/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  const handlePaymentClick = () => {
    setShowPaymentPopup(true);
  };

  const handleClosePopup = () => {
    setShowPaymentPopup(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { cardNumber, expiryDate, cvv } = formData;

    if (!/^4[0-9]{12}(?:[0-9]{3})?$/.test(cardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date';
    }
    if (!/^[0-9]{3}$/.test(cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate payment confirmation
      setPaymentConfirmed(true);
      setTimeout(() => handleClosePopup(), 2000); // Close after 2 seconds
    }
  };

  if (!booking) {
    return "";
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <Link onClick={handlePaymentClick}>
            <div className="text-3xl">${booking.price}</div>
          </Link>
        </div>
      </div>
      <PlaceGallery place={booking.place} />

      {showPaymentPopup && (
        <div className="payment-popup">
          <div className="payment-popup-content">
            <button className="payment-popup-close" onClick={handleClosePopup}>
              &times;
            </button>
            <h2 className="text-xl mb-4">Payment</h2>
            {paymentConfirmed && <div className="payment-confirmation">Payment Successful!</div>}
            <form className="payment-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9123 4567"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                />
                {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
                {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleInputChange}
                />
                {errors.cvv && <div className="error-message">{errors.cvv}</div>}
              </div>
              <button type="submit" className="payment-submit">Pay Now</button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .payment-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .payment-popup-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          max-width: 100%;
          position: relative;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .payment-popup-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: transparent;
          border: none;
          font-size: 24px;
          color: #333;
          cursor: pointer;
        }

        .payment-form .form-group {
          margin-bottom: 20px;
        }

        .payment-form .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .payment-form .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .error-message {
          color: red;
          font-size: 14px;
          margin-top: 5px;
        }

        .payment-submit {
          width: 100%;
          padding: 12px;
          background: #007bff;
          border: none;
          border-radius: 4px;
          color: white;
          font-size: 18px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .payment-submit:hover {
          background: #0056b3;
        }

        .payment-confirmation {
          color: green;
          font-size: 18px;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

export default BookingPage;
