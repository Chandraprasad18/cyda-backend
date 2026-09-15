const mongoose = require("mongoose");

const categoryWiseDataSchema = new mongoose.Schema({
    image: { type: String, required: true },
    firstHead: { type: String, required: true },
    boldParaContent: { type: String, required: true },
    normalParagraph: { type: String, required: true }
});

const imageContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    name: { type: String, required: true },
    pageName: { type: String }, 
    coverImage: { type: String }, 
    categoryWiseData: categoryWiseDataSchema 
});

const dataSchema = new mongoose.Schema({
    sectionKey: { type: String, required: true, unique: true }, // Jeemitiki: 'youthData', 'genderData', etc.
    intro: { type: String, required: true },
    imageContentArray: [imageContentSchema]
}, { timestamps: true });

module.exports = mongoose.model("DynamicContent", dataSchema);