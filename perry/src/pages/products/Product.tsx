import Header from "../../components/Header";
import BackToTopButton from "../../components/buttons/BackToTopButton";
import Footer from "../../components/Footer";
import "./Product.scss";


function Product() {
  return (
    <>
      <Header searchBar={true} cart={true}></Header>
      <BackToTopButton></BackToTopButton>

      <Footer></Footer>
    </>
  );
}

export default Product;