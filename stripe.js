const express = require("express");
const app = express();
const path = require("path");
const stripe = require("stripe")(
  "sk_test_51OnBx0Jk50s0cyZJTVLG9CUmuzYtFuVV4C6ILMUNjOsJKwYIhpp7MGUBFEzVG1gq23rcWAHOiQd1AbUz3DM969EF003vljxOuq"
);
const port = 8000;

app.post("/payment-sheet", async (req, res) => {
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2023-10-16" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "sgd",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51OnBx0Jk50s0cyZJiILj5ALHJiZEpKrASjMYuwcNUU4K5JZ2ty8yhMqkqPXj96h4JKuRqBHHlUjRn23BhKryWHHn00aiCNeH8U",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
