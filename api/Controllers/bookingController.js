import BookingModel from "../Models/bookingModel.js";
import JWT from "jsonwebtoken";
export const bookingController = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { checkIn, checkOut, numberOfGuests, name, phone, place, price } =
      req.body;

    BookingModel.create({
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      place,
      price,
      user: userData.id,
    })
      .then((doc, err) => {
        res.status(200).send({
          success: true,
          message: "Booking Done successfully",
          doc,
        });
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message: "Error while booking",
          error,
        });
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while booking",
      error,
    });
  }
};

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    JWT.verify(
      req.cookies.token,
      process.env.JWT_SECRET,
      {},
      async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      }
    );
  });
}

export const getBookingController = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    res.json(await BookingModel.find({ user: userData.id }).populate("place"));
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting bookings",
      error,
    });
  }
};
