import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../components/AddressLink";
import BookingDates from "../components/BookingDates";
import PlaceGallery from "../components/PlaceGallery";

const stripePromise = loadStripe("your-publishable-key"); // Replace with your Stripe publishable key

const BookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

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

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error(error);
    } else {
      console.log("Payment method created:", paymentMethod);
      // Here you would normally send `paymentMethod` to your backend for processing
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
          <div className="text-3xl">${booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />

      <Elements stripe={stripePromise}>
        <form onSubmit={handlePayment} className="mt-8">
          <h2 className="text-2xl mb-4">Enter Payment Information</h2>
          <CardElement className="p-4 border rounded-md" />
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-600 text-white rounded-md"
            disabled={!stripe}
          >
            Pay ${booking.price}
          </button>
        </form>
      </Elements>
    </div>
  );
};

export default BookingPage;
