import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: "sandbox",
  client_id: "AWX1KoDNB1oQStyyGCzILAQ5Fzu7zue-A4c_bMv56JNHa8ekI7MDOmcgf2sjrD13jhtdJh_KFTeiYWex",
  client_secret: "EP2hi9yYDgO6n1iIPdWeCCM9GGWwUbLdYXdapV3gRL32s5c5-6OGx3hUgRPNHjNsBolJYPM0LS8wEcxO",
});


export default paypal;