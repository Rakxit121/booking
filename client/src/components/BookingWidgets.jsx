import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext/UserContext";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BookingWidgets = ({ place }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  const isFormValid =
    checkIn && checkOut && numberOfGuests > 0 && name && phone;

  const bookThisPlace = async () => {
    try {
      if (checkIn === checkOut) {
        toast.error("Check-in and check-out dates cannot be the same.");
        return;
      }

      if (!isFormValid) {
        toast.error("Please fill out all the required fields.");
        return;
      }

      const response = await axios.post("/api/auth/bookings", {
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        place: place._id,
        price: numberOfNights * place.price,
      });

      toast.success("Booking done successfully");
      const bookingId = response.data.doc._id;
      navigate(`/account/bookings/${bookingId}`);
    } catch (error) {
      toast.error("An error occurred while booking.");
    }
  };

  const enabledButtonClass = isFormValid ? "primary" : "disabled";

  return (
    <>
      <div className="bg-white shadow p-4 rounded-2xl">
        <div className="text-2xl text-center">
          Price: ${place?.price} / per night
        </div>
        <div className="border rounded-2xl mt-4">
          <div className="flex">
            <div className="py-3 px-4">
              <label>Check in:</label>
              <input
                type="date"
                value={checkIn}
                onChange={(ev) => setCheckIn(ev.target.value)}
              />
            </div>
            <div className="py-3 px-4 border-l">
              <label>Check out:</label>
              <input
                type="date"
                value={checkOut}
                onChange={(ev) => setCheckOut(ev.target.value)}
              />
            </div>
          </div>
          <div className="py-3 px-4 border-t">
            <label>Number of guests:</label>
            <input
              type="number"
              value={numberOfGuests}
              onChange={(ev) => setNumberOfGuests(ev.target.value)}
            />
          </div>
          {numberOfNights > 0 && (
            <div className="py-3 px-4 border-t">
              <label>Your full name:</label>
              <input
                type="text"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
              <label>Phone number:</label>
              <input
                type="tel"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
              />
            </div>
          )}
        </div>
        <button
          onClick={bookThisPlace}
          className={`mt-4 ${enabledButtonClass}`}
          disabled={!isFormValid}
        >
          Book this place
          {numberOfNights > 0 && <span> ${numberOfNights * place.price}</span>}
        </button>
      </div>
    </>
  );
};

export default BookingWidgets;
