import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { CreateItemPage } from "./pages/CreateItemPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ChatPage } from "./pages/ChatPage";
import { EditItemPage } from "./pages/EditItemPage";

const App = () => (
  <>
    <Toaster position="top-right" />
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="register" element={<AuthPage mode="register" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="create" element={<CreateItemPage />} />
          <Route path="items/:id/edit" element={<EditItemPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Route>
    </Routes>
  </>
);

export default App;
