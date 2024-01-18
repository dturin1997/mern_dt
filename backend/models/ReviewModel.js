import { Schema, model } from "mongoose";

const reviewSchema = Schema(
  {
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    user: {
      _id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export default model("Review", reviewSchema);
