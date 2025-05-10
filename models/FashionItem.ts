import mongoose from 'mongoose';

const fashionItemSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  imageUrls: [String],
  description: String,
  timestamp: { type: Date, default: Date.now },
  comments: [
    {
      userId: String,
      userName: String,
      content: String,
      timestamp: { type: Date, default: Date.now },
    }
  ],
  shoppingLinks: [
    {
      title: String,
      url: String,
      platform: String,
      type: String,
    }
  ],
});

export default mongoose.models.FashionItem || mongoose.model('FashionItem', fashionItemSchema);