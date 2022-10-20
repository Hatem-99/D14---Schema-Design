import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentsSchema = new Schema(
  {
      comment: {type: String, required: true},
      rate: {type: Number, required: true},
    
  },
  {
      timestamps: true,
    }
  );

const blogsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number },
      unit: { type: Number },
    },
    authors: [
      { type: Schema.Types.ObjectId, ref: "author" }
    ],
    content: { type: String },
    comments: [commentsSchema]
  },
  {
    timestamps: true,
  }
);

export default model("blog", blogsSchema);
