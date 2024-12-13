import QuizGriddd from "@/components/subjectList/page";
import Image from "next/image";
export default function Dashboard() {
  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-[25%_75%] gap-[10px]  lg:h-[280px] mt-[40px] lg:bg-white px-4 py-8 rounded-[20px] shadow-md">
        <div>
          <Image
            className="w-[100%] h-[343px] lg:w-[215px] lg:h-[215px]"
            src={"/images/Frame 40.png"}
            height={500}
            width={500}
            alt="search-icon"
          />
        </div>
        <div className="flex flex-col gap-4">
            <div>

                <h1 className="text-[#4461F2] text-[32px] font-bold">
                    Ahmed Mohamed
                </h1>
                <p className="text-[#979CA3] text-[20px] font-normal">
                    Voluptatem aut
                </p>
            </div>
          <div className="relative h-3 w-[80%] bg-[#F5F5F5] rounded-[30px]">
            <div
              className="absolute top-0 left-0 h-full bg-[#4461F2] rounded-[30px]"
              style={{ width: "60%" }}
            ></div>
          </div>
            <div className="flex justify-between gap-5 pr-5 mt-10">
              <div className="flex xs:flex-col lg:flex-row justify-between items-center gap-4">
                <div className="flex justify-center items-center bg-white w-[40px] h-[40px] lg:w-[70px] lg:h-[70px] shadow-md rounded-[10px]">
                  <Image
                    className="w-[17px] h-[17px] lg:w-[38px] lg:h-[38px]"
                    src="/images/flag-icon.png"
                    alt="flag"
                    width={38}
                    height={38}
                  />
                </div>
                <div className="flex flex-col justify-center items-center lg:items-start ">
                  <p className="text-[18px] lg:text-[29px] text-[#696F79] font-bold">
                    27
                  </p>
                  <p className="text-sm lg:text-base font-normal text-[#696F79]">
                    Quiz Passed
                  </p>
                </div>
              </div>
              <div className="flex xs:flex-col lg:flex-row  justify-between items-center gap-4">
                <div className="flex justify-center items-center bg-white w-[40px] h-[40px] lg:w-[70px] lg:h-[70px] shadow-md rounded-[10px]">
                  <Image
                    className="w-[17px] h-[17px] lg:w-[38px] lg:h-[38px]"
                    src="/images/clock-icon.png"
                    alt="Fastest Time"
                    width={38}
                    height={38}
                  />
                </div>
                <div className="flex flex-col justify-center  lg:items-start items-center">
                  <p className="text-[18px] lg:text-[29px] text-[#696F79] font-bold">
                    13 min
                  </p>
                  <p className="text-sm lg:text-base font-normal text-[#696F79]">
                    Fastest Time
                  </p>
                </div>
              </div>
              <div className="flex xs:flex-col lg:flex-row  justify-between items-center gap-4">
                <div className="flex justify-center items-center bg-white w-[40px] h-[40px] lg:w-[70px] lg:h-[70px] shadow-md rounded-[10px]">
                  <Image
                    className="w-[17px] h-[17px] lg:w-[38px] lg:h-[38px]"
                    src="/images/check-icon.png"
                    alt="check"
                    width={38}
                    height={38}
                  />
                </div>
                <div className="flex flex-col justify-center lg:items-start items-center">
                  <p className="text-[18px] lg:text-[29px] text-[#696F79] font-bold">
                    200
                  </p>
                  <p className="text-sm lg:text-base font-normal text-[#696F79]">
                    Correct Answers
                  </p>
                </div>
              </div>
            </div>
        </div>
      </div>

      <QuizGriddd />
    </>
  );
}
