import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import "dotenv/config";
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

// API Controller Functin to manage Clerk User with database
// http://localhost:4000/api/user/webhooks

const clerkWebhooks = async (req, res) => {
  try {
    console.log("Webhook endpoint triggered!");
    // create a svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // req.body here is a raw Buffer (due to express.raw middleware)
    await whook.verify(req.body, {
      // pass raw body directly
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Now parse the JSON after verification
    const payload = JSON.parse(req.body.toString());

    const { data, type } = payload;

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };
        await userModel.create(userData);
        res.json({}); // Acknowledge the webhook
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };
        await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        res.json({});
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API Controller function to get user available credits data
const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.body;
    const userData = await userModel.findOne({ clerkId });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided clerkId.",
      });
    }

    res.json({
      success: true,
      credits: userData.creditBalance,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// initilize gateway
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to make payment for credits

const paymentRazorpay = async (req, res) => {
  try {
    const { clerkId, planId } = req.body;
    const userData = await userModel.findOne({ clerkId });

    if (!userData || !planId) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const plans = {
      Basic: { plan: "Basic", credits: 100, amount: 10 },
      Advanced: { plan: "Advanced", credits: 500, amount: 50 },
      Business: { plan: "Business", credits: 5000, amount: 250 },
    };

    let plan, credits, amount, date;

    if (plans[planId]) {
      ({ plan, credits, amount } = plans[planId]);
    }

    date = Date.now();

    // creating Transactioin
    const transactionData = {
      clerkId,
      plan,
      amount,
      credits,
      date,
    };

    // inserting in db
    const newTransaction = await transactionModel.create(transactionData);

    // creating order
    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id,
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        return res.json({
          success: false,
          order,
        });
      }
      res.json({
        success: true,
        order,
      });
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error" });
  }
};

// API Controller function to verify razor payment
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const transactionData = await transactionModel.findById(
        orderInfo.receipt
      );
      if (transactionData.payment) {
        return res.json({ success: false, message: "Payment Failed" });
      }

      // Adding Credits in user data
      const userData = await userModel.findOne({
        clerkId: transactionData.clerkId,
      });
      const creditBalance = userData.creditBalance + transactionData.credits;
      await userModel.findByIdAndUpdate(userData._id, { creditBalance });

      // making the payment true
      await transactionModel.findByIdAndUpdate(transactionData._id, {
        payment: true,
      });

      res.json({ success: true, message: "Credits Added" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { clerkWebhooks, userCredits, paymentRazorpay, verifyRazorpay };
