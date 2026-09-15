import mongoose from "mongoose";

const approachSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      subtitle: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
      },

      imageUrl: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

const Approach =
  mongoose.model(
    "Approach",
    approachSchema
  );

export default Approach;