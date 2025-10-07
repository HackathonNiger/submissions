
const ButtonUi = (props: any) => {
  return (
    <button className={`${props.className} w-full text-center bg-[#923B10] text-white text-xl py-1 rounded-full hover:border-[0.5px] hover:border-black hover:text-black hover:bg-transparent hover:duration-200 transition-all cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`} disabled={props.disabled || false}>{props.btnName}</button>
  )
}

export default ButtonUi