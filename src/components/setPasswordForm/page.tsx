'use client';

import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/rtk/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ButtonForm from '../button/page';
import { signIn } from 'next-auth/react';

interface FormValues {
  password: string;
  rePassword: string;
}

export default function SetPasswordForm() {
  const router = useRouter();
  const reduxEmail = useSelector((state: RootState) => state.email.email); 
  const [email, setEmail] = useState<string>(''); 
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isRetypeVisible, setRetypeVisible] = useState(false);

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

  const handleFormData = async (values: FormValues) => {
    try {
      const { data } = await axios.put('https://exam.elevateegy.com/api/v1/auth/resetPassword', {
        email,
        newPassword: values.password,
      });
      console.log(data);
      if (data.message === 'success') {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const validSchema = Yup.object({
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

  const formik = useFormik<FormValues>({
    initialValues: {
      password: '',
      rePassword: '',
    },
    validationSchema: validSchema,
    onSubmit: handleFormData,
  });

  const handleIdentityGoogle = async () => {
    signIn('google', { callbackUrl: '/' });
  };
  const handleIdentityFacebook = async () => {
    signIn('facebook', { callbackUrl: '/' });
  };
  const handleIdentityTwitter = async () => {
    signIn('twitter', { callbackUrl: '/' });
  };

  return (
    <div className="w-full">
      <h2 className="font-bold text-[24px] mb-[30px]">Set a Password</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-[32px] ">
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
          <p className="text-red-500 text-sm p-0">{formik.errors.password}</p>
        )}

        <div className="relative w-full">
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
          <p className="text-red-500 text-sm p-0">{formik.errors.rePassword}</p>
        )}

        <ButtonForm text={formik.isSubmitting ? 'Sending...' : 'Send'} />
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
