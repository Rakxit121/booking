import { Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import IndexPage from "./Pages/IndexPage";
import Layout from "./Layout";
import RegisterPage from "./Pages/RegisterPage";
import { UserContextProvider } from "./userContext/UserContext";
import ProfilePage from "./Pages/ProfilePage";
import PlacesPage from "./Pages/PlacesPage";
import PlacesForm from "./components/PlacesForm";
import PlacePage from "./Pages/PlacePage";
import BookingsPage from "./Pages/BookingsPage";
import BookingPage from "./Pages/BookingPage";
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
