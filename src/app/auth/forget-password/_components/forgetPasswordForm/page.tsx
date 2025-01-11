'use client'
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useState } from "react";
import { useRouter } from 'next/navigation'; 
import { signIn } from "next-auth/react";
import ButtonForm from "@/components/button/page";
import { resetPassword, sendForgotPasswordEmail, verifyResetCode } from "@/lib/actions/forgetPassword.action";


interface FormValues {
    email?: string;
    resetCode?: string;
    password?: string;
    rePassword?: string;
  }

  export default function ForgetPasswordForm() {
    const router = useRouter();
    const [responseSuccess, setResponse] = useState(null);
    const [apiEmail, setApiEmail] = useState("");
    const [apiError, setApiError] = useState(null);
    const [steps, setSteps] = useState("1");
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isRetypeVisible, setRetypeVisible] = useState(false);
  
    const handleResendCode = async () => {
      try {
        const data = await sendForgotPasswordEmail(apiEmail);
        setResponse(data.info);
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleFormData = async (values: FormValues) => {
      try {
        if (steps === '1') {
          const data = await sendForgotPasswordEmail(values.email || '');
          setApiEmail(values.email || '');
          setResponse(data.info);
          setSteps('2');
        } else if (steps === '2') {
          const data = await verifyResetCode(values.resetCode || '');
          setResponse(data.message);
          setSteps('3');
        } else if (steps === '3') {
          await resetPassword(apiEmail, values.password || '');
          router.push('/auth/login');
        }
      } catch (error) {
        setApiError(error.message || 'An error occurred');
      }
    };
  
    const getValidationSchema = () => {
      if (steps === '1') {
        return Yup.object({
          email: Yup.string().email('Invalid email address').required('Email is required'),
        });
      } else if (steps === '2') {
        return Yup.object({
          resetCode: Yup.string()
            .matches(/^\d{6}$/, "Reset code must be exactly 6 digits")
            .required("Reset code is required"),
        });
      } else if (steps === '3') {
        return Yup.object({
          password: Yup.string()
            .matches(
              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
              'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a number'
            )
            .matches(
              /^(?=.*?[#?!@$%^&*-])/,
              'Password must include at least one special character (#?!@$%^&*-)'
            )
            .required('Password is required'),
          rePassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirm password is required'),
        });
      }
    };
  
    const formik = useFormik<FormValues>({
      initialValues: {
        email: '',
        resetCode: '',
        password: '',
        rePassword: '',
      },
      validationSchema: getValidationSchema(),
      onSubmit: handleFormData,
    });
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.name === "email" && apiError) {
        setApiError(null);
      } else if (e.target.name === "resetCode" && apiError || responseSuccess) {
        setApiError(null);
        setResponse(null);
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
        {steps === "1" && <h2 className="font-bold text-[24px] mb-[30px]">Forgot your password?</h2>}
        {steps === "2" && <h2 className="font-bold text-[24px] mb-[30px]">Verify code</h2>}
        {steps === "3" && <h2 className="font-bold text-[24px] mb-[30px]">Set a Password</h2>}
      
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-[32px] ">
        {steps === "1" && 
        <div className="forget">

            <input
                type="email"
                placeholder="Email"
                name="email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={handleInputChange}
                className={`input-form px-[12px] text-gray-700 border border-gray-300 
                    focus:outline-none 
                    ${formik.touched.email && formik.errors.email 
                    ? 'focus:ring-2 focus:ring-red-500 border-red-500' 
                    : 'focus:ring-2 focus:ring-blue-500'}`}        />
                {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 mt-3 text-sm p-0">{formik.errors.email}</p>
                )}
                {apiError && (
                <p className="text-red-500 mt-3 text-sm p-0">{apiError}</p>
                )}
                {responseSuccess && (
                <p className="text-green-500 mt-3 text-sm p-0">{responseSuccess}</p>
                )}


        </div>
        }
        {steps === "2" &&
            <div className="verifyCode">
                      <input
                        type="text"
                        placeholder="Enter Code"
                        name="resetCode"
                        value={formik.values.resetCode}
                        onBlur={formik.handleBlur}
                        onChange={handleInputChange}
                        className={`input-form px-[12px] text-gray-700 border border-gray-300 
                            focus:outline-none 
                            ${formik.touched.resetCode && formik.errors.resetCode 
                            ? 'focus:ring-2 focus:ring-red-500 border-red-500' 
                            : 'focus:ring-2 focus:ring-blue-500'}`}        />
                        {formik.touched.resetCode && formik.errors.resetCode && (
                        <p className="text-red-500 mt-3 text-sm p-0">{formik.errors.resetCode}</p>
                        )}
                        {apiError && (
                        <p className="text-red-500 mt-3 text-sm p-0">{apiError}</p>
                        )}
                        {responseSuccess && (
                        <p className="text-green-500 mt-3 text-sm p-0">{responseSuccess}</p>
                        )}


                        <div className="text-end text-base font-normal mt-[10px]">
                            Didn’t receive a code?   
                            <span onClick={handleResendCode} className="text-[#4461F2] cursor-pointer" > Resend</span>
                        </div>
            </div>
        }
        {steps === "3" && 
            <div className="set-password">
                        <div className="relative w-full">
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                placeholder="Password"
                                name="password"
                                value={formik.values.password}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                className={`input-form px-[12px] text-gray-700 border border-gray-300 
                                        focus:outline-none 
                                        ${
                                        formik.touched.password && formik.errors.password
                                            ? 'focus:ring-2 focus:ring-red-500 border-red-500'
                                            : 'focus:ring-2 focus:ring-blue-500'
                                        }`}
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisible(!isPasswordVisible)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            >
                                <Image src="/images/eye.png" alt="eye" height={15} width={15} />
                            </button>
                        </div>
                            {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 mt-3 text-sm p-0">{formik.errors.password}</p>
                            )}

                        <div className="relative w-full mt-8">
                            <input
                                type={isRetypeVisible ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                name="rePassword"
                                value={formik.values.rePassword}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                className={`input-form px-[12px] text-gray-700 border border-gray-300 
                                        focus:outline-none 
                                        ${
                                        formik.touched.rePassword && formik.errors.rePassword
                                            ? 'focus:ring-2 focus:ring-red-500 border-red-500'
                                            : 'focus:ring-2 focus:ring-blue-500'
                                        }`}
                            />
                            <button
                                type="button"
                                onClick={() => setRetypeVisible(!isRetypeVisible)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            >
                                <Image src="/images/eye.png" alt="eye" height={15} width={15} />
                            </button>
                            </div>
                            {formik.touched.rePassword && formik.errors.rePassword && (
                            <p className="text-red-500 mt-3 text-sm p-0">{formik.errors.rePassword}</p>
                            )}
                        </div>
        }
        <ButtonForm text={formik.isSubmitting ? 'Sending...' : 'Send'}/>
        <div className="flex items-center justify-center my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-base">Or Continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="grid grid-cols-4 mx-[48px] gap-4">
            <div onClick={handleIdentityGoogle} className="login-item flex justify-center hover:shadow-lg items-center border py-[15px] shadow-md rounded-lg cursor-pointer">
                <Image width={25} height={25} alt="google" src={"/images/Logo Google.png"} />
            </div>
            <div onClick={handleIdentityFacebook} className="login-item flex justify-center hover:shadow-lg items-center border py-[15px] shadow-md rounded-lg cursor-pointer">
                <Image width={25} height={25} alt="google" src={"/images/Vector.png"} />
            </div>
            <div onClick={handleIdentityTwitter} className="login-item flex justify-center hover:shadow-lg items-center border py-[15px] shadow-md rounded-lg cursor-pointer">
                <Image width={25} height={25} alt="google" src={"/images/Logo.png"} />
            </div>
            <div
            // onClick={() => signIn("github", { callbackUrl: "/" })}
            className="login-item flex justify-center hover:shadow-lg items-center border py-[15px] shadow-md rounded-lg cursor-pointer"
            >
                <Image width={25} height={25} alt="google" src={"/images/Logo (1).png"} />
            </div>
        </div>
      </form>
    </div>
  );
}
