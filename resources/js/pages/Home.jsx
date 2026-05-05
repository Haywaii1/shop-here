import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Navbar from "../components/NavBar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Categories from "../components/Categories";
import Deals from "../components/Deals";
import DealsSlider from "../components/DealsSlider";
import ClothingSection from "../components/ClothingSection";
import FeaturedProducts from "../components/FeaturedProducts";
import DealOfTheDay from "../components/DealOfTheDay";

export default function Home() {
    return (
        <>
            <TopBar />
            <Header />
            <Navbar />
            <Hero />
            <Features />
            <Categories />
            <DealOfTheDay />
            <Deals />
            <DealsSlider />
            <ClothingSection />
            <FeaturedProducts />
        </>
    );
}