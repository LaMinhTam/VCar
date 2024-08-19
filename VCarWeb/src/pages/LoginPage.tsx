import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { loginRequest } from "../store/authSlice";
import type { AppDispatch } from "../store/store";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(loginRequest({ email, password }));
      navigate("/");
    } catch (error) {
      console.error("Failed to login", error);
      setError(t("loginFailed"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-light">
      <h1 className="mb-6 text-2xl font-bold text-primary-default">
        {t("login")}
      </h1>
      <form className="w-full max-w-sm" onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-neutral-dark">
            {t("email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:ring-primary-light"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-neutral-dark">
            {t("password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:ring-primary-light"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-primary-default rounded hover:bg-primary-dark"
        >
          {t("login")}
        </button>
      </form>
      <p className="mt-4 text-neutral-dark">
        {t("dontHaveAccount")}{" "}
        <span
          className="text-primary-default cursor-pointer hover:underline"
          onClick={() => navigate("/signup")}
        >
          {t("signUp")}
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
