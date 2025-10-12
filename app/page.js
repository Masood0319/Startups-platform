import Image from "next/image";
import Hero from "./components/hero";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import StartupsShowcase from "./components/startupsShowCase";

export default function Home() {
  return (
    <>
    <Navbar/>
    <Hero/>
    <StartupsShowcase/>
    <Footer/>
    </>
  );
}
