import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/authSlice";
import type { AppDispatch } from "../store/store";
import { useTranslation } from "react-i18next";

const SignUpPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert(t("passwordsDoNotMatch"));
      return;
    }
    try {
      await dispatch(registerUser({ email, password }));
      navigate("/signin");
    } catch (error) {
      console.error("Failed to sign up", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-light">
      <h1 className="mb-6 text-2xl font-bold text-primary-default">{t("signUp")}</h1>
      <form className="w-full max-w-sm" onSubmit={handleSignUp}>
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
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-neutral-dark">
            {t("confirmPassword")}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:ring-primary-light"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-primary-default rounded hover:bg-primary-dark"
        >
          {t("signUp")}
        </button>
      </form>
      <p className="mt-4 text-neutral-dark">
        {t("alreadyHaveAccount")}{" "}
        <span
          className="text-primary-default cursor-pointer hover:underline"
          onClick={() => navigate("/signin")}
        >
          {t("signIn")}
        </span>
      </p>
    </div>
  );
};

export default SignUpPage;
