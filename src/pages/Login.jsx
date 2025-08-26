import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Navbar from "../components/Navbar";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const { register, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Yup validation schemas
  const validationSchema = Yup.object().shape({
    name: currentState === "Sign Up" 
      ? Yup.string().required("Name is required") 
      : Yup.string(),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // ✅ Initial values
  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  // ✅ Handle Submit
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (currentState === "Sign Up") {
        await register(values);
        alert("Registration successful! Please log in.");
        setCurrentState("Login");
        resetForm();
      } else {
        const loggedInUser = await login({
          email: values.email,
          password: values.password,
        });

        // ✅ Save user in localStorage
        localStorage.setItem("user", JSON.stringify(loggedInUser));

        alert("Welcome!");
        if (loggedInUser.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl">{currentState}</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
          </div>

          {currentState === "Sign Up" && (
            <div className="w-full">
              <Field
                type="text"
                name="name"
                placeholder="Name"
                className="w-full px-3 py-2 border border-gray-800"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          )}

          <div className="w-full">
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-800"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="w-full">
            <Field
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-800"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="w-full flex justify-between text-sm -mt-2">
            <p className="cursor-pointer">Forgot Your Password?</p>
            {currentState === "Login" ? (
              <p
                onClick={() => setCurrentState("Sign Up")}
                className="cursor-pointer"
              >
                Create account
              </p>
            ) : (
              <p
                onClick={() => setCurrentState("Login")}
                className="cursor-pointer"
              >
                Login Here
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white font-light px-8 py-2 mt-4 disabled:opacity-50"
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
