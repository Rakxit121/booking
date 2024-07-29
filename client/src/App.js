import { Route, Routes } from "react-router-dom";
import PlacesForm from "./components/PlacesForm";
import Layout from "./Layout";
import BookingPage from "./Pages/BookingPage";
import BookingsPage from "./Pages/BookingsPage";
import IndexPage from "./Pages/IndexPage";
import LoginPage from "./Pages/LoginPage";
import PlacePage from "./Pages/PlacePage";
import PlacesPage from "./Pages/PlacesPage";
import ProfilePage from "./Pages/ProfilePage";
import RegisterPage from "./Pages/RegisterPage";
import { UserContextProvider } from "./userContext/UserContext";


function App() {
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/account/bookings" element={<BookingsPage />} />
            <Route path="/account/bookings/:id" element={<BookingPage />} />
            <Route path="/account/places" element={<PlacesPage />} />
            <Route path="/account/places/new" element={<PlacesForm />} />
            <Route path="/account/places/:id" element={<PlacesForm />} />
            <Route path="/place/:id" element={<PlacePage />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
