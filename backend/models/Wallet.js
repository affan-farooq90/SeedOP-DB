import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  walletName: {
    type: String,
    required: true,
  },
  seedPhrase: {
    type: [String],
    required: function () {
      return !this.privateKey;
    }, // Either seedPhrase or privateKey is required
  },
  privateKey: {
    type: String,
    required: function () {
      return !this.seedPhrase;
    }, // Either seedPhrase or privateKey is required
  },
}, { timestamps: true });

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
