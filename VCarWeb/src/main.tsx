import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutMain from "./layouts/LayoutMain.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import store from "./store/store.ts";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import Loading from "./components/common/Loading.tsx";

import "./locales";
import HomePage from "./pages/HomePage.tsx";
import { AuthProvider } from "./contexts/auth-context.tsx";
import { AuthContextType } from "./types/common.ts";
import CarDetailPage from "./pages/CarDetailPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
const router = createBrowserRouter([
  {
    element: <LayoutMain />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/car/:id",
        element: <CarDetailPage />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />
      }
    ],
  },
  {
    element: <LoginPage />,
    path: "/signin",
  },
  {
    element: <SignUpPage />,
    path: "/signup",
  },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider value={{} as AuthContextType}>
        <App>
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-full h-screen mx-auto">
                <Loading />
              </div>
            }
          >
            <RouterProvider router={router}></RouterProvider>
          </Suspense>
        </App>
        <ToastContainer bodyClassName="font-primary text-sm"></ToastContainer>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
