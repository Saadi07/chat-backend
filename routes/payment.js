const router = require("express").Router();
const SECRET_KEY =
  "sk_test_51Lt4syGhM53qkdZktXtPTD6YULeEF0ho9iUd7cF3WH6VVOnIVxqxEvzLsOKmsp3tryMqR9P3VN9eBX6HjEkajnqE000J97hvOz";
const stripe = require("stripe")(SECRET_KEY);

router.post("/", async (req, res) => {
  console.log("hello form card");
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: "aed",
    payment_method_types: ["card"],
  });
  res.send({ dt: paymentIntent.client_secret });
});

module.exports = router;
