import mongoose from "mongoose";

const donationOptionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  purpose: { type: String, required: true },
});

const donateSchema = new mongoose.Schema(
  {
    coverImage: {
      type: String,
      required: false,
    },
    headline: {
      type: String,
      default: "MAKE A DIFFERENCE SUPPORT TODAY!",
    },
    mainHeading: {
      type: String,
      default: "I WOULD LIKE TO SUPPORT A",
    },
    subHeading: {
      type: String,
      default: "CHILD EDUCATION",
    },
    donationOptions: [donationOptionSchema], 
  },
  { timestamps: true }
);

const Donate = mongoose.model("Donate", donateSchema);
export default Donate;