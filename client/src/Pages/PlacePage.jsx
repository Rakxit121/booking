import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidgets from "../components/BookingWidgets";

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/auth/places/${id}`)
        .then((response) => {
          setPlace(response.data.place);
        })
        .catch((error) => {
          console.error("Error fetching place data:", error);
        });
    }
  }, [id]);

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white min-h-screen p-8 grid gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">Photos of {place?.title}</h2>
          <button
            onClick={() => setShowAllPhotos(false)}
            className="flex items-center gap-1 py-2 px-4 rounded-2xl shadow-sm shadow-black bg-white text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
            Close photos
          </button>
        </div>
        {place?.photos?.map((photo, index) => (
          <div key={index}>
            <img
              className="w-full object-contain"
              src={`http://localhost:5000/uploads/${photo}`}
              alt={`Photo ${index + 1} of ${place?.title}`}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl mb-4">{place?.title}</h1>
      <a
        className="flex gap-1 my-3 font-semibold underline"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://maps.google.com/?q=${place?.address}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        {place?.address}
      </a>
      <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
          {place?.photos?.slice(0, 3).map((photo, index) => (
            <div key={index}>
              <img
                onClick={() => setShowAllPhotos(true)}
                className={`cursor-pointer object-cover w-full ${
                  index === 2 ? "relative top-2" : ""
                }`}
                src={`http://localhost:5000/uploads/${photo}`}
                alt={`Photo ${index + 1} of ${place?.title}`}
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
              clipRule="evenodd"
            />
          </svg>
          Show more photos
        </button>
      </div>

      <div className="grid mt-8 mb-8 gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            <p>{place?.description}</p>
          </div>
          <div>
            <p>Check-in: {place?.checkIn}</p>
            <p>Check-out: {place?.checkOut}</p>
            <p>Max number of guests: {place?.maxGuests}</p>
          </div>
        </div>
        <div>
          <BookingWidgets place={place} />
        </div>
      </div>

      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
          <div className="text-sm text-gray-700 leading-5 mt-2">
            {place?.extraInfo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
