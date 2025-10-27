import logo from "../../../public/images/logos/swiv-white-nobg.png"
import blogo from "../../../public/images/logos/swiv-black-nobg.png"
import mlogo from "../../../public/images/logos/icon.png"
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <>
      <Link href={"/"} className="flex items-center">
        <Image className="w-16 hidden dark:md:flex" src={logo} alt="logo"/>
        <Image className="w-16 hidden md:flex dark:hidden" src={blogo} alt="logo"/>
        <Image className="w-8 md:hidden flex" src={mlogo} alt="mlogo"/>
      </Link>
    </>
  );
}