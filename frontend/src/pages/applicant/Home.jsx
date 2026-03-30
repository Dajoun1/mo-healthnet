import Contact from "./Contact";
import Features from "./Features";
import Header from "./Header";

// pages/Home.jsx
const Home = () => {
  return (
    <div className="container px-4  mx-auto">
      <Header />
      <Features />
      <Contact />
    </div>
  );
};

export default Home;