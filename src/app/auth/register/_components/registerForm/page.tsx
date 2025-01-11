"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import ButtonForm from "@/components/button/page";
import { registerUser } from "@/lib/actions/register.action";


export default function RegisterForm() {
  const router = useRouter();
  const [apiUserError, setApiUserError] = useState("");
  const [apiEmailError, setApiEmailError] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isRetypeVisible, setRetypeVisible] = useState(false);

  const handleFormData = async (values : FormValues) => {
    try {
      const data = await registerUser(values); 
      if (data.message === "success") {
        router.push("/auth/login");
      }

    } catch (error ) {
      if (error.message.includes("username already exists")) {
        setApiUserError("Username already exists");
      } else if (error.message.includes("email already exists")) {
        setApiEmailError("Email already exists");
      }
    }
  };
  const validSchema = Yup.object({
    username: Yup.string()
      .matches(/^[a-zA-Z]+$/, "Username must contain only characters")
      .min(4, "Username must be at least 4 characters")
      .max(25, "Username cannot exceed 25 characters")
      .required("Username is required"),
    firstName: Yup.string()
      .matches(/^[a-zA-Z]+$/, "First name must contain only letters")
      .required("First name is required"),
    lastName: Yup.string()
      .matches(/^[a-zA-Z]+$/, "Last name must contain only letters")
      .required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
        "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a number"
      )
      .matches(
        /^(?=.*?[#?!@$%^&*-])/,
        "Password must include at least one special character (#?!@$%^&*-)"
      )
      .required("Password is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, "Invalid phone number")
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .required("Phone number is required"),
  });
  const formik = useFormik<FormValues>({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    validationSchema: validSchema,
    onSubmit: handleFormData,
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "username" && apiUserError) {
      setApiUserError("");
    }
    if (e.target.name === "email" && apiEmailError) {
      setApiEmailError("");
    }
    formik.handleChange(e);
  };
  const handleIdentityGoogle = async () => {
    signIn("google", { callbackUrl: "/" });
  };
  const handleIdentityFacebook = async () => {
    signIn("facebook", { callbackUrl: "/" });
  };
  const handleIdentityTwitter = async () => {
    signIn("twitter", { callbackUrl: "/" });
  };
  return (
    <div className="w-full">
      <h2 className="font-bold text-[24px] mb-[30px]">Sign up</h2>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-[25px] "
      >
        <input
          type="text"
          placeholder="UserName"
          name="username"
          value={formik.values.username}
          onBlur={formik.handleBlur}
          onChange={handleInputChange}
          className={`input-form px-[12px] text-gray-700 border border-gray-300 
            focus:outline-none 
            ${
              (formik.touched.username && formik.errors.username) ||
              apiUserError
                ? "focus:ring-2 focus:ring-red-500 border-red-500"
                : "focus:ring-2 focus:ring-blue-500"
            }`}
        />
        {formik.touched.username && formik.errors.username && (
          <p className="text-red-500 text-sm p-0">{formik.errors.username}</p>
        )}
        {apiUserError && (
          <p className="text-red-500 text-sm p-0">{apiUserError}</p>
        )}
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={formik.values.firstName}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          className={`input-form px-[12px] text-gray-700 border border-gray-300 
            focus:outline-none 
            ${
              formik.touched.firstName && formik.errors.firstName
                ? "focus:ring-2 focus:ring-red-500 border-red-500"
                : "focus:ring-2 focus:ring-blue-500"
            }`}
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <p className="text-red-500 text-sm p-0">{formik.errors.firstName}</p>
        )}
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={formik.values.lastName}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          className={`input-form px-[12px] text-gray-700 border border-gray-300 
            focus:outline-none 
            ${
              formik.touched.lastName && formik.errors.lastName
                ? "focus:ring-2 focus:ring-red-500 border-red-500"
                : "focus:ring-2 focus:ring-blue-500"
            }`}
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <p className="text-red-500 text-sm p-0">{formik.errors.lastName}</p>
        )}
        <input
          type="text"
          placeholder="Phone"
          name="phone"
          value={formik.values.phone}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          className={`input-form px-[12px] text-gray-700 border border-gray-300 
            focus:outline-none 
            ${
              formik.touched.phone && formik.errors.phone
                ? "focus:ring-2 focus:ring-red-500 border-red-500"
                : "focus:ring-2 focus:ring-blue-500"
            }`}
        />
        {formik.touched.phone && formik.errors.phone && (
          <p className="text-red-500 text-sm p-0">{formik.errors.phone}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formik.values.email}
          onBlur={formik.handleBlur}
          onChange={handleInputChange}
          className={`input-form px-[12px] text-gray-700 border border-gray-300 
            focus:outline-none 
            ${
              (formik.touched.email && formik.errors.email) || apiEmailError
                ? "focus:ring-2 focus:ring-red-500 border-red-500"
                : "focus:ring-2 focus:ring-blue-500"
            }`}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm p-0">{formik.errors.email}</p>
        )}
        {apiEmailError && (
          <p className="text-red-500 text-sm p-0">{apiEmailError}</p>
        )}
        <div className="relative w-full">
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={formik.values.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            className={`input-form px-[12px] text-gray-700 border border-gray-300 
                    focus:outline-none 
                    ${
                      formik.touched.password && formik.errors.password
                        ? "focus:ring-2 focus:ring-red-500 border-red-500"
                        : "focus:ring-2 focus:ring-blue-500"
                    }`}
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!isPasswordVisible)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            <Image src={"/images/eye.png"} alt="eye" height={15} width={15} />
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm p-0">{formik.errors.password}</p>
        )}
        <div className="relative w-full">
          <input
            type={isRetypeVisible ? "text" : "password"}
            placeholder="Confirm Password"
            name="rePassword"
            value={formik.values.rePassword}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            className={`input-form px-[12px] text-gray-700 border border-gray-300 
                    focus:outline-none 
                    ${
                      formik.touched.rePassword && formik.errors.rePassword
                        ? "focus:ring-2 focus:ring-red-500 border-red-500"
                        : "focus:ring-2 focus:ring-blue-500"
                    }`}
          />
          <button
            type="button"
            onClick={() => setRetypeVisible(!isRetypeVisible)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            <Image src={"/images/eye.png"} alt="eye" height={15} width={15} />
          </button>
        </div>
        {formik.touched.rePassword && formik.errors.rePassword && (
          <p className="text-red-500 text-sm p-0">{formik.errors.password}</p>
        )}
        <p className="text-center text-base font-normal mb-[30px]">
          Already have an account?
          <Link className="text-[#4461F2]" href={"/auth/login"}>
            Login
          </Link>
        </p>
        <ButtonForm
          text={formik.isSubmitting ? "Create Account..." : "Create Account"}
        />
        <div className="flex items-center justify-center my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-base">Or Continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="grid grid-cols-4 mx-[48px] gap-4">
          <div
            onClick={handleIdentityGoogle}
            className="login-item flex justify-center hover:shadow-lg items-center border py-[15px] shadow-md rounded-lg cursor-pointer"
          >
            <Image
              width={25}
              height={25}
              alt="google"
              src={"/images/Logo Google.png"}
            />
          </div>
          <div
            onClick={handleIdentityFacebook}
            className="login-item flex justify-center hover:shadow-lg items-center border py-[15px] shadow-md rounded-lg cursor-pointer"
          >
            <Image
              width={25}
              height={25}
              alt="google"
              src={"/images/Vector.png"}
            />
          </div>
          <div
            onClick={handleIdentityTwitter}
            className="login-item flex justify-center hover:shadow-lg items-center border py-[15px] shadow-md rounded-lg cursor-pointer"
          >
            <Image
              width={25}
              height={25}
              alt="google"
              src={"/images/Logo.png"}
            />
          </div>
          <div
            // onClick={() => signIn("github", { callbackUrl: "/" })}
            className="login-item flex justify-center hover:shadow-lg items-center border py-[15px] shadow-md rounded-lg cursor-pointer"
          >
            <Image
              width={25}
              height={25}
              alt="google"
              src={"/images/Logo (1).png"}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
