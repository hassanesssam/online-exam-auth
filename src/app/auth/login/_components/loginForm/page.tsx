"use client";
import Image from "next/image";
import Link from "next/link";
import ButtonForm from "../../../../../components/button/page";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

interface FormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const handleFormData = async (values: FormValues) => {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    console.log(result);
    if (result?.error) {
      if (result.status === 401) {
        formik.setErrors({ password: "Incorrect email or password" });
      } else {
        formik.setErrors({
          email: "An unexpected error occurred. Please try again later.",
        });
      }
    } else if (result?.ok) {
      router.push("/dashboard");
    }
  };
  const validSchema = Yup.object({
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
  });
  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validSchema,
    onSubmit: handleFormData,
  });
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
      <h2 className="font-bold text-[24px] mb-[30px]">Sign in</h2>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-[32px] "
      >
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          value={formik.values.email}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          className={`input-form px-[12px] text-gray-700 border border-gray-300 
            focus:outline-none 
            ${
              formik.touched.email && formik.errors.email
                ? "focus:ring-2 focus:ring-red-500 border-red-500"
                : "focus:ring-2 focus:ring-blue-500"
            }`}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm p-0">{formik.errors.email}</p>
        )}

        <div className="relative w-full">
          <input
            type={isVisible ? "text" : "password"}
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
            onClick={() => setIsVisible(!isVisible)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            <Image src={"/images/eye.png"} alt="eye" height={15} width={15} />
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm py-[0px]">
            {formik.errors.password}
          </p>
        )}

        <p className="text-end text-base font-normal mb-[10px]">
          <Link className="text-[#4461F2]" href={"/auth/forget-password"}>
            Recover Password ?
          </Link>
        </p>
        <ButtonForm text={formik.isSubmitting ? "Signing in..." : "Sign in"} />
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
          <div className="login-item flex justify-center hover:shadow-lg items-center border py-[15px] shadow-md rounded-lg cursor-pointer">
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
