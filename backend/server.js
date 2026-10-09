import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Wallet from "./models/Wallet.js";
import cors from 'cors'

// Initialize environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;  // Fallback port if not in .env

// Middleware to parse JSON data
app.use(express.json());
app.use(cors())

const uri = process.env.MONGO_URI; // MongoDB URI from .env

// Mongoose connection function
async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
}

// Call the database connection
connectDB();

// ----- Routes ----- //

// Get all wallets (for listing wallets)
app.get("/api/wallets", async (req, res) => {
  try{
    const wallets = await Wallet.find();
    res.json(wallets);
  }catch(error){
    res.status(500).json({message:"Error fetching Wallets", error})
  }
});

// Get a single wallet by ID (for viewing details)
app.get("/api/wallets/:id", async(req, res) => {
  const {id} = req.params;
  try{
    const wallet = await Wallet.findById(id);
    if(!wallet){
      return res.status(404).json({message:"Wallet Not Found"})
    }
    res.json(wallet)
  }catch(error){
    res.status(500).json({message:"Error fetching Wallet", error})
  }
});

// Create a new wallet (seed phrase or private key)
app.post("/api/wallets", async (req, res) => {
  const { walletName, seedPhrase, privateKey } = req.body;
  try{
    const newWallet = new Wallet({
      walletName,
      seedPhrase:seedPhrase || null,
      privateKey:privateKey || null });
    await newWallet.save();
    res.status(201).json(newWallet)
  }catch(error){
    res.status(400).json({message:"Error creating Wallet", error})
  }
});

// Update a wallet (for editing seed phrase or private key)
app.put("/api/wallets/:id", async (req, res) => {
  const { id } = req.params;
  const { walletName, seedPhrase, privateKey } = req.body;
  try{
    const updatedWallet = await Wallet.findByIdAndUpdate(
      id,
      { walletName, seedPhrase, privateKey },
      { new: true } // Return the updated document
    );
    if(!updatedWallet){
      return res.status(404).json({message:"Wallet Not Found"})
    }
    res.json(updatedWallet);
  }catch(error){
    res.status(400).json({ message: "Error updating wallet", error });
  }
});

// Delete a wallet by ID (for removing a wallet)
app.delete("/api/wallets/:id", async(req, res) => {
  const { id } = req.params;
  try{
    const deletedWallet = await Wallet.findByIdAndDelete(id);
    if(!deletedWallet){
      return res.status(404).json({message:"Wallet Not Found"})
    }
    res.json({messgae:"Wallet Deleted", wallet:deletedWallet});
  }catch(error){
    res.status(500).json({message:"Error deleting Wallet", error})
  }
});



// Global error handler (for unexpected errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
