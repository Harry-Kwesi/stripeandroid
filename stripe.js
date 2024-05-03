const express = require("express");
const app = express();
const path = require("path");
const stripe = require("stripe")("");
const port = 8000;

// Route to fetch customer's cards
app.get("/v1/customers/:id/cards", async (req, res) => {
  try {
    const customerId = "cus_PnuOphxSbYxAtB";

    // Retrieve customer's cards using the Stripe API
    const cards = await stripe.customers.listSources(customerId, {
      object: "card",
    });

    res.json({ cards: cards.data });
  } catch (error) {
    console.error("Error fetching customer's cards:", error);
    res.status(500).json({ error: "Failed to fetch customer's cards" });
  }
});

app.post("/payment-sheet", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2023-10-16" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "sgd",
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: "",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
