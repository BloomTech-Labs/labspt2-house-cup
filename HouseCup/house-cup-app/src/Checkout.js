
// import STRIPE_PUBLISHABLE from './constants/stripe';
// import PAYMENT_SERVER_URL from './constants/server';

import React  from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import cup from './images/images.jpg'


const Checkout = () => {
  const publishableKey = "pk_test_WyufeHp9FTBavFWAOUqK0icx00EoXVThGt";   
  const onToken = token => {
        const body = {
          amount: 1999,
          token: token
        };
  axios
      .post("http://localhost:5000/payment", body)
      .then(response => {
        console.log(response);
        console.log(response.data.success.id)
        alert("Payment Success");
      })
      .catch(error => {
        console.log("Payment Error: ", error);
        alert("Payment Error");
      });
  };

  return (
    <StripeCheckout
      label="Go Premium" //Component button text
      name="House-Cup" //Modal Header
      description="Upgrade to a premium account today."
      panelLabel="Go Premium" //Submit button in modal
      amount={1999} //Amount in cents $9.99
      token={onToken}
      image={cup}
      stripeKey={publishableKey}      
      billingAddress={false}
    />
  );
};

export default Checkout;
