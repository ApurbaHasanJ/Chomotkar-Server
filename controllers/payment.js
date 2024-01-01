const express = require("express");

// ssl commerz
const SSLCommerzPayment = require("sslcommerz-lts");
const productsCollection = require("../models/products");
const { ObjectId } = require("mongodb");
const couponsCollection = require("../models/coupon");
const orderCollection = require("../models/payment");
const { DateTime } = require("luxon");

// ssl support
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false; //true for live, false for sandbox

// post order
const handlePostOrder = async (req, res) => {
  const order = req.body;
  console.log(order);

  // Finding product from the database
  const product = await productsCollection.findOne({
    _id: new ObjectId(order.productId),
  });

  // Coupon code
  const couponCode = order?.couponCode || "";

  // Order quantity
  const quantity = order?.quantity;

  // Product price
  const productPrice = product?.newPrice ? product?.newPrice : product?.price;

  // Shipping charges
  const shippingCharge = { insideDhaka: 40, outsideDhaka: 140 };

  // User location
  const location = order?.location;

  // Calculate total amount without considering discount and shipping charge
  const subAmount = productPrice * quantity;

  // Coupon discount
  let discountPercentage = 0;
  if (couponCode) {
    const couponDiscount = await couponsCollection.findOne({
      code: couponCode,
    });
    if (couponDiscount) {
      //   console.log("Coupon details:", couponDiscount);
      discountPercentage = couponDiscount.discount;
      //   console.log("Discount", discountPercentage);
    }
  }

  // Calculate total amount with discount
  const discountedAmount = subAmount - (subAmount * discountPercentage) / 100;

  // Calculate total amount with discount and shipping charge
  let totalAmount;
  if (location === "insideDhaka") {
    totalAmount = discountedAmount + shippingCharge.insideDhaka;
  } else {
    totalAmount = discountedAmount + shippingCharge.outsideDhaka;
  }

  console.log(product?._id);

  console.log("Subtotal:", subAmount);
  console.log("Total Amount:", totalAmount);

  // generate transaction id
  const tran_id = new ObjectId().toJSON();
  //   console.log("tran id", tran_id);

  const data = {
    total_amount: totalAmount,
    currency: "BDT",
    tran_id: tran_id,
    success_url: `http://localhost:5000/order/payment/success/${tran_id}`,
    fail_url: `http://localhost:5000/order/payment/failed/${tran_id}`,
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: product?.title,
    product_category: product?.subCategory,
    product_profile: product?.category,
    cus_name: order?.name,
    cus_email: order?.email,
    cus_add1: order?.address,
    cus_add2: order?.address,
    cus_city: order?.location,
    cus_state: order?.location,
    cus_postcode: "",
    cus_country: "Bangladesh",
    cus_phone: order?.phone,
    cus_fax: "",
    ship_name: order?.name,
    ship_add1: order?.address,
    ship_add2: order?.address,
    ship_city: order?.location,
    ship_state: order?.location,
    ship_postcode: order?.location,
    ship_country: "Bangladesh",
  };

  console.log(data);
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse) => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;
    //   res.redirect(GatewayPageURL);
    res.send({ url: GatewayPageURL });

    // Get the current date and time of the server
    const currentServerDateTime = DateTime.utc();

    // Set the locale to English
    const enDateTime = currentServerDateTime.setLocale("en");

    // Format the date and time in English language
    const formattedEnDateTime = enDateTime.toLocaleString({
      locale: "en",
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Dhaka", // You can adjust the timeZone as needed
    });

    // take data for store in mongoDB
    const finalOrder = {
      productId: product?._id,
      paidStatus: false,
      transactionId: tran_id,
      cusName: order?.name,
      cusPhone: order?.phone,
      cusEmail: order?.email,
      cusAdd: order?.address,
      cusLocation: order?.location,
      couponCode: couponCode,
      quantity: quantity,
      totalAmount: totalAmount,
      createdAt: formattedEnDateTime,
    };

    const result = orderCollection.insertOne(finalOrder);
  });
};

// payment success function
const handlePostSuccessOrder = async (req, res) => {
  const tranId = req.params.tranId;
  const result = await orderCollection.updateOne(
    {
      transactionId: tranId,
    },
    {
      $set: {
        paidStatus: true,
      },
    }
  );
  if (result.modifiedCount > 0) {
    res.redirect(`http://localhost:5173/payment/success/${tranId}`);
  }
};

const handleDeleteFailedOrder = async (req, res) => {
  tranId = req.params.tranId;
  const result = await orderCollection.deleteOne({ transactionId: tranId });
  if (result.deletedCount) {
    res.redirect(`http://localhost:5173/payment/failed/${tranId}`);
  }
};

module.exports = {
  handlePostOrder,
  handlePostSuccessOrder,
  handleDeleteFailedOrder,
};
