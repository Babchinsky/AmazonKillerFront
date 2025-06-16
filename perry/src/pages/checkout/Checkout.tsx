import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch, RootState } from "../../state/store";
import { clearCart, getCart } from "../../state/cart/cart-slice";
import { createOrder } from "../../state/orders/orders-slice";
import { checkoutFormSchema, CheckoutFormType } from "../../schemes/checkout-schema";
import { getCityOptions, getCountryName, getCountryOptions, getStateName, getStateOptions } from "../../utils/getLocation";
import FormInput from "../../components/inputs/FormInput";
import FormComboBox from "../../components/combo-boxes/FormComboBox";
import PaymentMethodToggle from "../../components/toggles/PaymentMethodToggle";
import Button from "../../components/buttons/Button";
import CheckoutSuccess from "../../components/popups/account/CheckoutSuccess";
import LogoIcon from "../../assets/icons/logo.svg?react";
import checkoutStyles from "./Checkout.module.scss";


function Checkout() {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormType>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onBlur",
    defaultValues: {
      country: "",
      state: "",
      city: "",
      paymentMethod: "cash"
    },
  });

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [isCheckoutSuccessOpen, setIsCheckoutSuccessOpen] = useState<boolean>(false);

  const accessToken = localStorage.getItem("accessToken");

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const selectedCity = watch("city");

  const countryOptions = [{ id: "select", label: "Select country" }, ...getCountryOptions()];
  const stateOptions = selectedCountry
    ? [{ id: "select", label: "Select state" }, ...getStateOptions(selectedCountry)]
    : [{ id: "select", label: "Select state" }];
  const cityOptions = selectedCountry && selectedState
    ? [{ id: "select", label: "Select city" }, ...getCityOptions(selectedCountry, selectedState)]
    : [{ id: "select", label: "Select city" }];

  const cartItems = useSelector((state: RootState) => state.cart.items ?? []);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  const [totalCurrencyMajor, totalCurrencyMinor] = totalPrice.split(".");

  const submitForm = async (data: CheckoutFormType) => {
    const orderData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      country: getCountryName(data.country),
      state: getStateName(data.state, data.country),
      city: data.city,
      street: "Test St",
      houseNumber: "1",
      apartmentNumber: "10",
      postCode: data.postcode,
      paymentType: paymentMethod === "cash" ? 0 : 1,

      cardNumber: paymentMethod === "card" ? data.cardNumber : null,
      expirationDate: paymentMethod === "card" ? data.cardExpirationDate : null,
      cvv: paymentMethod === "card" ? data.cardSecurityCode : null
    };
    console.log(orderData);

    try {
      const resultAction = await dispatch(createOrder(orderData));
      
      if (createOrder.fulfilled.match(resultAction)) {
        setIsCheckoutSuccessOpen(true);
        dispatch(clearCart());
      } 
      else {
        console.error("Order failed:", resultAction.payload);
      }
    } 
    catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      dispatch(getCart());
    }
  }, [dispatch, accessToken]);

  useEffect(() => {
    const action = isCheckoutSuccessOpen ? "add" : "remove";
    document.body.classList[action]("body-no-scroll");
    document.documentElement.classList[action]("html-no-scroll");

    return () => {
      document.body.classList.remove("body-no-scroll");
      document.documentElement.classList.remove("html-no-scroll");
    };
  }, [isCheckoutSuccessOpen]);

  return (
    <div className="page appear-transition">
      <main className={checkoutStyles.checkoutMain}>
        <section className={checkoutStyles.checkoutSection}>
          <form className={checkoutStyles.checkoutFormContainer} onSubmit={handleSubmit(submitForm)} noValidate>
            <div className={checkoutStyles.checkoutFormTopContainer}>
              <div className={checkoutStyles.titleContainer}>
                <div className={checkoutStyles.logoContainer}>
                  <Link className="link" to="/">
                    <LogoIcon className={checkoutStyles.logoIcon} />
                  </Link>
                </div>

                <h2>Checkout</h2>
              </div>

              <hr className="divider" />
            </div>
            
            <div className={checkoutStyles.checkoutFormBottomContainer}>
              <div className={checkoutStyles.formContainer}>
                <div className={checkoutStyles.recipientInformationContainer}>
                  <h3>Recipient information</h3>

                  <div className={checkoutStyles.inputsContainer}>
                    <FormInput
                      type="text"
                      title="First name"
                      placeholder="Enter your first name"
                      {...register("firstName")}
                      isError={!!errors.firstName}
                      errorMessage={errors.firstName?.message}
                    />
                    <FormInput
                      type="text"
                      title="Last name"
                      placeholder="Enter your last name"
                      {...register("lastName")}
                      isError={!!errors.lastName}
                      errorMessage={errors.lastName?.message}
                    />
                    <FormInput
                      className={checkoutStyles.emailInput}
                      type="email"
                      {...register("email")}
                      isError={!!errors.email}
                      errorMessage={errors.email?.message}
                    />
                  </div>
                </div>

                <hr className="divider" />

                <div className={checkoutStyles.deliveryAddressContainer}>
                  <h3>Delivery address</h3>

                  <div className={checkoutStyles.inputsContainer}>
                    <FormComboBox
                      {...register("country")}
                      name="country"
                      title="Country"
                      value={
                        selectedCountry
                          ? { id: selectedCountry, label: getCountryName(selectedCountry) }
                          : { id: "select", label: "Select country" }
                      }
                      onChange={(option) => {
                        setValue("country", option.id === "select" ? "" : option.id);
                        setValue("state", "");
                        setValue("city", "");
                        trigger("country");
                      }}
                      options={countryOptions}
                      isError={!!errors.country}
                      errorMessage={errors.country?.message}
                    />
                    <FormComboBox
                      {...register("state")}
                      disabled={!selectedCountry}
                      name="state"
                      title="State"
                      value={
                        selectedState
                          ? { id: selectedState, label: getStateName(selectedState, selectedCountry) }
                          : { id: "select", label: "Select state" }
                      }
                      onChange={(option) => {
                        setValue("state", option.id === "select" ? "" : option.id);
                        setValue("city", "");
                        trigger("state");
                      }}
                      options={stateOptions}
                      isError={!!errors.state}
                      errorMessage={errors.state?.message}
                    />
                    <FormComboBox
                      {...register("city")}
                      disabled={!selectedState}
                      name="city"
                      title="City"
                      value={
                        selectedCity
                          ? { id: selectedCity, label: selectedCity }
                          : { id: "select", label: "Select city" }
                      }
                      onChange={(option) => {
                        setValue("city", option.id === "select" ? "" : option.id);
                        trigger("city");
                      }}
                      options={cityOptions}
                      isError={!!errors.city}
                      errorMessage={errors.city?.message}
                    />
                    <FormInput
                      type="text"
                      title="Postcode"
                      placeholder="Enter postcode"
                      {...register("postcode")}
                      isError={!!errors.postcode}
                      errorMessage={errors.postcode?.message}
                    />
                  </div>
                </div>

                <hr className="divider" />

                <div className={checkoutStyles.paymentMethodContainer}>
                  <h3>Payment method</h3>
                  <PaymentMethodToggle 
                    selected={paymentMethod} 
                    onChange={setPaymentMethod} 
                  />
                </div>

                {paymentMethod === "card" && (
                  <>
                    <hr className="divider" />
                    
                    <div className={checkoutStyles.cardDetailsContainer}>
                      <h3>Card details</h3>
                      <div className={checkoutStyles.inputsContainer}>
                        <FormInput
                          type="text"
                          title="Card number"
                          placeholder="0000-0000-0000-0000"
                          {...register("cardNumber")}
                          isError={!!errors.cardNumber}
                          errorMessage={errors.cardNumber?.message}
                        />
                        <FormInput
                          type="text"
                          title="Date of expiration"
                          placeholder="01/01"
                          {...register("cardExpirationDate")}
                          isError={!!errors.cardExpirationDate}
                          errorMessage={errors.cardExpirationDate?.message}
                        />
                        <FormInput
                          type="text"
                          title="CVV/CVC"
                          placeholder="***"
                          {...register("cardSecurityCode")}
                          isError={!!errors.cardSecurityCode}
                          errorMessage={errors.cardSecurityCode?.message}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
  
              <div className={checkoutStyles.summaryContainer}>
                <div className={checkoutStyles.summaryTopContainer}>
                  <h3>Summary</h3>
                  <hr className="divider" />
                </div>
                
                <div className={checkoutStyles.summaryScrollableContainer}>
                  {cartItems.length > 0 && (
                    <div className={checkoutStyles.checkoutItemListContainer}>
                      {cartItems.map((item, index) => (  
                        <div key={index} className={checkoutStyles.checkoutItemContainer}>
                          <p>{item.name}</p>

                          <div className={checkoutStyles.itemPriceContainer}>
                            {(() => {
                              const totalItemPrice = (item.price * item.quantity).toFixed(2);
                              const [currencyMajor, currencyMinor] = item.price.toFixed(2).split(".");
                              const [totalItemCurrencyMajor, totalItemCurrencyMinor] = totalItemPrice.split(".");

                              return (
                                <>
                                  <div className={checkoutStyles.itemQuantityPriceContainer}>
                                    <p className={checkoutStyles.price}>
                                      <span className={checkoutStyles.quantity}>{item.quantity}</span>
                                      <span className={checkoutStyles.x}>x</span>
                                      <span className={checkoutStyles.currency}>$</span>
                                      <span>{currencyMajor}</span>
                                      <span className={checkoutStyles.currencyMinor}>{currencyMinor}</span>
                                    </p>
                                  </div>

                                  <div className={checkoutStyles.totalItemPriceContainer}>
                                    <p className={checkoutStyles.price}>
                                      <span className={checkoutStyles.currency}>$</span>
                                      <span>{totalItemCurrencyMajor}</span>
                                      <span className={checkoutStyles.currencyMinor}>{totalItemCurrencyMinor}</span>
                                    </p>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div> 
                      ))}
                    </div>
                  )}
                </div>

                <div className={checkoutStyles.summaryBottomContainer}>
                  <hr className="divider" />

                  <div className={checkoutStyles.totalContainer}>
                    <p>Total:</p>
                    <div className={checkoutStyles.totalPriceContainer}>
                      <p className={checkoutStyles.price}>
                        <span className={checkoutStyles.currency}>$</span>
                        <span>{totalCurrencyMajor}</span>
                        <span className={checkoutStyles.currencyMinor}>{totalCurrencyMinor}</span>
                      </p>
                    </div>
                  </div>

                  <div className={checkoutStyles.buttonsContainer}>
                    <Button className={checkoutStyles.placeOrderButton} type="primary" content="Place order" onClick={handleSubmit(submitForm)} />
                    <Button type="secondary" content="Cancel" onClick={() => {}} />
                  </div>

                  <p className={checkoutStyles.checkoutNotice}>By clicking “Continue”, you agree with <span className={checkoutStyles.highlight}>PERRY Terms and Conditions</span></p>
                </div>
              </div>
            </div>
          </form>

          {isCheckoutSuccessOpen && <CheckoutSuccess />}
        </section>
      </main>
    </div>
  );
}

export default Checkout;