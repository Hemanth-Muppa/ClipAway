import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import "dotenv/config";

// API Controller Functin to manage Clerk User with database
// http://localhost:4000/api/user/webhooks

const clerkWebhooks = async (req, res) => {
  try {
    console.log("Webhook endpoint triggered!");
    // create a svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // req.body here is a raw Buffer (due to express.raw middleware)
    await whook.verify(req.body, { // pass raw body directly
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
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

export { clerkWebhooks, userCredits };