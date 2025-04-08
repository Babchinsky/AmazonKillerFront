import Header from "../../components/Header";
import BackToTopButton from "../../components/buttons/BackToTopButton";
import Footer from "../../components/Footer";
import "./Main.scss";


function Main() {
  return (
    <>
      <Header searchBar={true} cart={true}></Header>
      <BackToTopButton></BackToTopButton>

      <section className="content-container"></section>

      <Footer></Footer>
    </>
  );
}

export default Main;