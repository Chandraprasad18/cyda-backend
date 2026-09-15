import mongoose from "mongoose";

const adolescentSchema = new mongoose.Schema(
    {
        heading: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Adolescent = mongoose.model("Adolescent", adolescentSchema);
export default Adolescent;