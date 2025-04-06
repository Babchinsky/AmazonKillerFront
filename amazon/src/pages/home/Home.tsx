import Header from "../../components/Header";
import BackToTopButton from "../../components/buttons/BackToTopButton";
import Footer from "../../components/Footer";
import "./Home.scss";


function Home() {
  return (
    <>
      <Header searchBar={true} cart={true}></Header>
      <BackToTopButton></BackToTopButton>

      <section className="content-container"></section>

      <Footer></Footer>
    </>
  );
}

export default Home;