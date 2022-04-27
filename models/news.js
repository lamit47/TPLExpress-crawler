const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const newsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    pubDate: {
      type: Date,
      required: true
    },
    content: {
      type: String
    },
    description: {
      type: String
    },
    information: {
      type: String
    },
    author: {
      type: String
    },
    images: [{
      link: {
        type: String
      },
      description: {
        type: String
      }
    }],
    success: {
      type: Boolean,
      default: false,
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const News = mongoose.model("News", newsSchema);

module.exports = { News }