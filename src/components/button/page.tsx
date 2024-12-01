const ButtonForm = ({ text }: { text: string }) => {
  return (
    <button
      type="submit"
       className="w-full bg-[#4461F2] h-[55px] text-white rounded-[20px]"
    >
      {text}
    </button>
  );
};

export default ButtonForm;

