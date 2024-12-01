'use client'
import Image from "next/image";
import Link from "next/link";
import ButtonForm from "../button/page";
import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useState } from "react";
import { useRouter } from 'next/navigation'; 
import { useDispatch } from 'react-redux';
import { setEmail } from "@/rtk/slices/emailSlice";
import { signIn } from "next-auth/react";


interface FormValues {
  email: string;
}

export default function ForgetPasswordForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [responseSucces , setResponse]= useState(null)
  const [apiEmailError , setApiEmailError]= useState(null)


  const saveEmailToLocalStorage = (email: string) => {
    localStorage.setItem('email', email);
  };

  const handleFormData = async(values : FormValues) => {
    try {
      const { data } = await axios.post("https://exam.elevateegy.com/api/v1/auth/forgotPassword", values);
      console.log(data);
      if (data.message === "success") {
        dispatch(setEmail(values.email));
        saveEmailToLocalStorage(values.email);
        setResponse(data.info)
        router.push('/verify-code');

      }
    } catch (error) {
        if(axios.isAxiosError(error)){
            if(error.response?.data.code === 404){
              setApiEmailError(error.response?.data.message)
            }

        }
    }
  };
const validSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  })
const formik = useFormik<FormValues>({
    initialValues:{
        email: '',
    },
    validationSchema : validSchema
    ,onSubmit : handleFormData
})
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.name === "email" && apiEmailError) {
    setApiEmailError(null);
  }
  formik.handleChange(e); 
};
const handleIdentityGoogle = async()=>{
  signIn("google" , { callbackUrl: "/" });
}
const handleIdentityFacebook = async()=>{
  signIn("facebook" , { callbackUrl: "/" });
}
const handleIdentityTwitter = async()=>{
  signIn("twitter" , { callbackUrl: "/" });
}

  return (
    <div className="w-full">
      <h2 className="font-bold text-[24px] mb-[30px]">Forgot your password?</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-[32px] ">

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
          <p className="text-red-500 text-sm p-0">{formik.errors.email}</p>
        )}
        {apiEmailError && (
          <p className="text-red-500 text-sm p-0">{apiEmailError}</p>
        )}
        {responseSucces && (
          <p className="text-green-500 text-sm p-0">{responseSucces}</p>
        )}


        <p className="text-end text-base font-normal mb-[10px]">
          <Link className="text-[#4461F2]" href={"/login"}>
            Recover Password ?
          </Link>
        </p>
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
