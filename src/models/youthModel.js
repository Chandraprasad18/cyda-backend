import mongoose from "mongoose";

const youthSchema = new mongoose.Schema({
    youthHeading: {
        type: String,
        required: true,
        trim: true
    },
    coverImage: {
        type: String,
        required: false
    },
    imageContentArray: [
        {
            image: String,
            title: String,
            categoryWiseData: Array
        }
    ]
}, { timestamps: true });

export default mongoose.model("Youth", youthSchema);