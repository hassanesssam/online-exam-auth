'use client'
import Image from "next/image";
import ButtonForm from "../button/page";
import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; 
import { signIn } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from '@/rtk/store';




interface FormValues {
    resetCode: string;
  }
  

export default function VerifyCodeForm() {
    const router = useRouter();
    const [apiUserError , setApiUserError]= useState(null)
    const reduxEmail = useSelector((state: RootState) => state.email.email); 
    const [responseSucces , setResponse]= useState(null)

    const [email, setEmail] = useState<string>(''); 


    useEffect(() => {
      if (reduxEmail) {
        setEmail(reduxEmail);
      } else {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
          setEmail(storedEmail);
        } else {
          router.push('/forgot-password'); 
        }
      }
    }, [reduxEmail, router]);
    const handleResendCode = async()=>{
      try {
        const { data } = await axios.post("https://exam.elevateegy.com/api/v1/auth/forgotPassword", {
          email
        });
        console.log(data);
        if (data.message === "success") {

          setResponse(data.info)
          // router.push('/verify-code');
  
        }
      } catch (error) {
          if(axios.isAxiosError(error)){
              console.log(error);
              
          }
      }
    }
    const handleFormData = async(values : FormValues) => {
        try {
          const { data } = await axios.post("https://exam.elevateegy.com/api/v1/auth/verifyResetCode", values);
          console.log(data);
          if (data.status === "Success") {
            router.push('/set-password');

          }
        } catch (error) {
            if(axios.isAxiosError(error)){
                if(error.response?.data.code === 400){
                    setApiUserError(error.response?.data.message)
                }
    
            }
        }
      };
    const validSchema = Yup.object({
        resetCode: Yup.string()
        .matches(/^\d{6}$/, "Reset code must be exactly 6 digits")
        .required("Reset code is required"),
      })
    const formik = useFormik<FormValues>({
        initialValues:{
            resetCode: '',
        },
        validationSchema : validSchema
        ,onSubmit : handleFormData
    })
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "resetCode" && apiUserError || responseSucces) {
            setApiUserError(null);
            setResponse(null);
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
      <h2 className="font-bold text-[24px] mb-[30px]">Verify code</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-[32px] ">

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
          <p className="text-red-500 text-sm p-0">{formik.errors.resetCode}</p>
        )}
        {apiUserError && (
          <p className="text-red-500 text-sm p-0">{apiUserError}</p>
        )}
        {responseSucces && (
          <p className="text-green-500 text-sm p-0">{responseSucces}</p>
        )}


        <div className="text-end text-base font-normal mb-[10px]">
         Didn’t receive a code?   
           <span onClick={handleResendCode} className="text-[#4461F2] cursor-pointer" > Resend</span>
        </div>
        <ButtonForm text={formik.isSubmitting ? 'Verify...' : 'Verify'}/>
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
