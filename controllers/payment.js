const axios = require("axios");
const globals = require("node-global-storage");
const { ObjectId } = require("mongodb");
const productsCollection = require("../models/products");
const couponsCollection = require("../models/coupon");
const orderCollection = require("../models/payment");
const { v4: uuidv4 } = require("uuid");

const bkashHeaders = async () => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    authorization: globals.get("id_token"),
    "x-app-key": process.env.bkash_api_key,
  };
};

// post order
const handlePostOrder = async (req, res) => {
  const order = req.body.data;
  console.log(order);
  // console.log("productId",order.productId);

  // Finding product from the database
  const product = await productsCollection.findOne({
    _id: new ObjectId(order.productId),
  });
  // console.log(product);

  // Coupon code
  const couponCode = order?.couponCode || "";

  // Order quantity
  const quantity = order?.quantity;

  // Product price
  const productPrice = product?.newPrice ? product?.newPrice : product?.price;
  // console.log("produtctprice", productPrice);

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
      // console.log("Coupon details:", couponDiscount);
      discountPercentage = couponDiscount.discount;
      // console.log("Discount", discountPercentage);
    }
  }
  let discountedAmount;
  // Calculate total amount with discount
  if (discountPercentage > 0) {
    const amount = subAmount - (subAmount * discountPercentage) / 100;
    discountedAmount = amount;
  } else if (discountPercentage === 0) {
    discountedAmount = subAmount;
  }

  // console.log("discountedAmount", discountPercentage);

  // Calculate total amount with discount and shipping charge
  let totalAmount;
  if (location === "insideDhaka") {
    totalAmount =
      order?.totalAmount || discountedAmount + shippingCharge.insideDhaka;
  } else {
    totalAmount =
      order?.totalAmount || discountedAmount + shippingCharge.outsideDhaka;
  }

  console.log("total", totalAmount);
  // console.log(product?._id);

  // console.log("Subtotal:", subAmount);
  // console.log("Total Amount:", totalAmount);

  // generate transaction id
  // const tran_id = new ObjectId().toJSON();
  const merchantInvoiceNumber = "INV" + uuidv4().substring(0, 5);
  //   console.log("tran id", tran_id);

  try {
    if (order?.paymentMethod === "bkash") {
      const { data } = await axios.post(
        process.env.bkash_create_payment_url,
        {
          mode: "0011",
          payerReference: order?.phone,
          callbackURL:
            "https://chomotkar-server-iota.vercel.app/bkash/payment/callback",
          amount: order?.totalAmount || totalAmount,
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: order?.orderINV || merchantInvoiceNumber,
        },
        {
          headers: await bkashHeaders(),
        }
      );

      if (order?.orderINV && order?.orderId) {
        console.log(order?.orderINV, order?.orderId);
        const result = await orderCollection.updateOne(
          { _id: new ObjectId(order.orderId) },
          {
            $set: {
              paymentID: data.paymentID || "",
              orderNote: order?.orderNote || "",
              paymentMethod: order?.paymentMethod,
            },
          }
        );
        console.log(result);
      }

      // take data for store in mongoDB
      const finalOrder = {
        productId: product?._id,
        paidStatus: false,
        orderStatus: "pending",
        INV: merchantInvoiceNumber,
        trxID: "",
        paymentID: data.paymentID || "",
        paymentDate: "",
        payedAmount: 0,
        cusName: order?.name,
        cusPhone: order?.phone,
        cusReceiverPhone: order?.receiverPhone,
        cusEmail: order?.email,
        cusAdd: order?.address,
        cusLocation: order?.location,
        couponCode: couponCode,
        orderNote: order?.orderNote || "",
        color: order?.color,
        size: order?.size,
        quantity: quantity,
        totalAmount: totalAmount,
        paymentMethod: order?.paymentMethod,
        createdAt: order?.date,
        acceding: new Date(),
      };
      if (!order?.orderINV) {
        const result = await orderCollection.insertOne(finalOrder);
      }
      res.send(data);
    } else {
      // take data for store in mongoDB
      const finalOrder = {
        productId: product?._id,
        paidStatus: false,
        orderStatus: "pending",
        INV: merchantInvoiceNumber,
        trxID: "",
        paymentID: "",
        paymentDate: "",
        payedAmount: 0,
        cusName: order?.name,
        cusPhone: order?.phone,
        cusReceiverPhone: order?.receiverPhone,
        cusEmail: order?.email,
        cusAdd: order?.address,
        cusLocation: order?.location,
        couponCode: couponCode,
        orderNote: order?.orderNote || "",
        color: order?.color,
        size: order?.size,
        quantity: quantity,
        totalAmount: totalAmount,
        paymentMethod: order?.paymentMethod,
        createdAt: order?.date,
        acceding: new Date(),
      };
      const result = await orderCollection.insertOne(finalOrder);
      res.send(result);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ error: error.message });
  }
};

const handlePaymentCallback = async (req, res) => {
  console.log("Payment Callback Received:", req.query);

  const { paymentID, status } = req.query;
  console.log(status);
  // In handlePaymentCallback function
  if (status === "cancel" || status === "failure") {
    console.log("error", req.query);

    // Delete payment info using paymentID
    try {
      const deleteResult = await orderCollection.deleteOne({
        paymentID: paymentID,
      });

      if (deleteResult.deletedCount > 0) {
        console.log("Payment info deleted successfully");
      } else {
        console.log("No payment info found to delete");
      }
    } catch (deleteError) {
      console.error("Error deleting payment info:", deleteError.message);
    }

    return res.redirect(
      `https://chomotkarfashion-67485.web.app/payment/error?message=${status}`
    );
  }

  // if success
  if (status === "success") {
    try {
      const { data } = await axios.post(
        process.env.bkash_execute_payment_url,
        { paymentID },
        { headers: await bkashHeaders() }
      );

      if (data && data.statusCode === "0000") {
        console.log("success", data);
        const result = await orderCollection.updateOne(
          { paymentID: data.paymentID },
          {
            $set: {
              paidStatus: true,
              trxID: data.trxID,
              paymentDate: data.paymentExecuteTime,
              payedAmount: parseInt(data.amount),
            },
          }
        );

        if (result.modifiedCount > 0) {
          return res.redirect(
            `https://chomotkarfashion-67485.web.app/payment/success/${data.trxID}`
          );
        } else {
          throw new Error("Failed to update order status");
        }
      } else {
        throw new Error(`bKash API Error: ${data.statusMessage}`);
      }
    } catch (error) {
      console.error(error.message);
      return res.redirect(
        `https://chomotkarfashion-67485.web.app/payment/error?message=${error.message}`
      );
    }
  }
};

const handleRefundOrder = async (req, res) => {
  const id = req.params;
  // console.log(id);

  try {
    const findPayment = await orderCollection.findOne({
      _id: new ObjectId(id),
    });
    // console.log("finf",findPayment);

    if (!findPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const data = await axios.post(
      process.env.bkash_refund_transaction_url,
      {
        paymentID: findPayment.paymentID,
        amount: findPayment.payedAmount,
        trxID: findPayment.trxID,
        sku: "payment",
        reason: "cashback",
      },
      {
        headers: await bkashHeaders(),
      }
    );

    console.log("axios", data.data);

    if (data && data.data.statusCode === "0000") {
      console.log("going to update");
      const result = await orderCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            paidStatus: false,
            orderStatus: "refund",
            refundTrxID: data.data.refundTrxID,
            refundStatus: data.data.transactionStatus,
            refundTime: data.data.completedTime,
          },
        }
      );

      console.log("Refund success:", result);

      res.send(result);
    } else {
      console.error("Refund failed:", data);
      return res.status(400).json({ error: "Refund failed", details: data });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  handlePostOrder,
  handlePaymentCallback,
  handleRefundOrder,
};
