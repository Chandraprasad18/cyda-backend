import mongoose from "mongoose";

const imageContentSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    name: { type: String, trim: true },
    categoryWiseData: {
      image: { type: String },
      firstHead: { type: String },
      boldParaContent: { type: String },
      normalParagraph: { type: String },
    },
  },
  { _id: true }
);

const newProgramSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, lowercase: true, trim: true },
    intro: { type: String },
    coverImage: { type: String },
    imageContentArray: { type: [imageContentSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("new_program_data", newProgramSchema);