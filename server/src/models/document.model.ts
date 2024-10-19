import { model, Schema, type Document } from "mongoose";

interface IDocument extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  versions: {
    content: string;
    timestamp: Date;
  }[];
}

const DocumentSchema = new Schema<IDocument>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  versions: [
    {
      content: {
        type: String,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

DocumentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const DocumentModel = model<IDocument>("Document", DocumentSchema);

export default DocumentModel;
