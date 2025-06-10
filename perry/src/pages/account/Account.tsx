import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Account.scss";


function Account() {
  return (
    <>
      <Header searchBar={true} cart={true}></Header>

      <Footer></Footer>
    </>
  );
}

export default Account;