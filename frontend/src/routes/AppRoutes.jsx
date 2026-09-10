import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import AddItemPage from "../pages/AddItemPage";
import BrowseItemsPage from "../pages/BrowseItemsPage";
import ItemDetailsPage from "../pages/ItemDetailsPage";
import MyItemsPage from "../pages/MyItemsPage";
import EditItemPage from "../pages/EditItemPage";

import CreateClaimPage from "../pages/CreateClaimPage";
import MyClaimsPage from "../pages/MyClaimsPage";
import ReceivedClaimsPage from "../pages/ReceivedClaimsPage";
import ClaimDetailsPage from "../pages/ClaimDetailsPage";

import NotificationsPage from "../pages/NotificationsPage";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import ChangePasswordPage from "../pages/ChangePasswordPage";

import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminItemsPage from "../pages/AdminItemsPage";
import AdminClaimsPage from "../pages/AdminClaimsPage";
import AdminUserPostsPage from "../pages/AdminUserPostsPage";
import AdminContactMessagesPage from "../pages/AdminContactMessagesPage";

import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


        {/* ================= DASHBOARD LAYOUT ================= */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          {/* ================= USER ROUTES ================= */}

          <Route path="/home" element={<HomePage />} />

          <Route
            path="/browse-items"
            element={<BrowseItemsPage />}
          />

          <Route
            path="/add-item"
            element={<AddItemPage />}
          />

          <Route
            path="/items/:id"
            element={<ItemDetailsPage />}
          />

          <Route
            path="/my-items"
            element={<MyItemsPage />}
          />

          <Route
            path="/edit-item/:id"
            element={<EditItemPage />}
          />

          <Route
            path="/claims/create/:itemId"
            element={<CreateClaimPage />}
          />

          <Route
            path="/my-claims"
            element={<MyClaimsPage />}
          />

          <Route
            path="/received-claims"
            element={<ReceivedClaimsPage />}
          />

          <Route
            path="/claims/:id"
            element={<ClaimDetailsPage />}
          />

          <Route
            path="/notifications"
            element={<NotificationsPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

          <Route
            path="/edit-profile"
            element={<EditProfilePage />}
          />

          <Route
            path="/change-password"
            element={<ChangePasswordPage />}
          />


          {/* ================= ADMIN ROUTES ================= */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/items"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminItemsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/claims"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminClaimsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/:id/posts"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminUserPostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contact-messages"
            element={
               <ProtectedRoute adminOnly={true}>
                 <AdminContactMessagesPage />
               </ProtectedRoute>
            }
          />

        </Route>


        {/* ================= NOT FOUND ================= */}

        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;