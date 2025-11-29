import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [serverError, setServerError] = useState("");
  const { user, register, login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Validation schema - UPDATED FOR YOUR BACKEND
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores")
      .required("Username is required"),
    email: currentState === "Sign Up" 
      ? Yup.string()
          .email("Invalid email format")
          .required("Email is required")
      : Yup.string(),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    // Remove password2 validation for login, keep for signup
    ...(currentState === "Sign Up" && {
      password2: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password')
    })
  });

  // Initial values
  const initialValues = {
    username: "",
    email: "",
    password: "",
    password2: "",
  };

  // Submit handler - UPDATED FOR COOKIE AUTH
  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
    setServerError("");
    
    try {
      if (currentState === "Sign Up") {
        await register({
          username: values.username,
          email: values.email,
          password: values.password,
          password2: values.password2,
        });

        alert("Registration successful! Please log in.");
        setCurrentState("Login");
        resetForm();
      } else {
        // For login, use identifier (can be username or email)
        await login({
          username: values.username, // This can be username or email per your backend
          password: values.password,
        });

        // Login successful - user will be redirected by the useEffect
        alert("Login successful!");
        // No need to manually navigate, useEffect will handle it
      }
    } catch (err) {
      console.error("Form submission error:", err);
      
      // Handle specific field errors from backend
      const errorMessage = err.message.toLowerCase();
      
      if (errorMessage.includes("username")) {
        setFieldError("username", err.message);
      } else if (errorMessage.includes("email")) {
        setFieldError("email", err.message);
      } else if (errorMessage.includes("password")) {
        if (errorMessage.includes("confirm") || errorMessage.includes("password2")) {
          setFieldError("password2", err.message);
        } else {
          setFieldError("password", err.message);
        }
      } else {
        // General server error
        setServerError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while checking authentication state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading...</div>
      </div>
    );
  }

  // Don't render form if user is logged in (will redirect)
  if (user) {
    return null;
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, values }) => (
          <Form className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
            <div className="inline-flex items-center gap-2 mb-2 mt-10">
              <p className="prata-regular text-3xl">{currentState}</p>
              <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
            </div>

            {/* Server Error Message */}
            {serverError && (
              <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {serverError}
              </div>
            )}

            {/* Username/Email Field - Updated label for login */}
            <div className="w-full">
              <Field
                type="text"
                name="username"
                placeholder={currentState === "Login" ? "Username or Email" : "Username"}
                className={`w-full px-3 py-2 border ${
                  errors.username && touched.username ? 'border-red-500' : 'border-gray-800'
                }`}
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Email only in Sign Up */}
            {currentState === "Sign Up" && (
              <div className="w-full">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full px-3 py-2 border ${
                    errors.email && touched.email ? 'border-red-500' : 'border-gray-800'
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )}

            {/* Password (always shown) */}
            <div className="w-full">
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className={`w-full px-3 py-2 border ${
                  errors.password && touched.password ? 'border-red-500' : 'border-gray-800'
                }`}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Confirm Password only in Sign Up */}
            {currentState === "Sign Up" && (
              <div className="w-full">
                <Field
                  type="password"
                  name="password2"
                  placeholder="Confirm Password"
                  className={`w-full px-3 py-2 border ${
                    errors.password2 && touched.password2 ? 'border-red-500' : 'border-gray-800'
                  }`}
                />
                <ErrorMessage
                  name="password2"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )}

            <div className="w-full flex justify-between text-sm -mt-2">
              <button
                type="button"
                className="cursor-pointer text-gray-600 hover:text-gray-800"
              >
                Forgot Your Password?
              </button>

              {currentState === "Login" ? (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentState("Sign Up");
                    setServerError("");
                  }}
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                >
                  Create account
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentState("Login");
                    setServerError("");
                  }}
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                >
                  Login Here
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white font-light px-8 py-2 mt-4 disabled:opacity-50 hover:bg-gray-800 transition-colors w-full"
            >
              {isSubmitting
                ? "Please wait..."
                : currentState === "Login"
                ? "Sign In"
                : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;


