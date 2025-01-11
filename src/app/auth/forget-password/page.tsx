import AuthVector from "@/components/authVector/page";
import NavAuth from "@/components/navAuth/page";
import ForgetPasswordForm from "./_components/forgetPasswordForm/page";

export default function ForgetPassword() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[100px] h-screen">
        <div className="hidden md:block">
          <AuthVector />
        </div>
        <div>
          <div className="pt-[40px] md:pt-[80px] pr-[20px] md:pr-[70px]">
            <NavAuth />
          </div>
          <div className="pl-[10px] pr-[30px] py-[60px] md:pl-[20px] md:pr-[200px] md:py-[150px]">
            <ForgetPasswordForm />
          </div>
        </div>
      </div>
    </>
  )
}


