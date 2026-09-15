import mongoose from 'mongoose';

const getInvolvedSchema = new mongoose.Schema({
  heading: { type: String, default: "Get Involved" },
  description: { type: String, default: "We invite you to join us on a journey where we can learn and grow together." },
  joinButtonText: { type: String, default: "Join Us" },
  quoteText: { type: String, default: "I am the change I wish to see..." },
  images: {
    handshakeIcon: { type: String, default: '' },
    footerImage: { type: String, default: '' },
    unstoppableImage: { type: String, default: '' }
  }
}, { timestamps: true });

const GetInvolved = mongoose.models.GetInvolved || mongoose.model('GetInvolved', getInvolvedSchema);

export default GetInvolved;