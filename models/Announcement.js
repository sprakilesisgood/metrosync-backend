const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['info', 'delay', 'alert'],
      default: 'info',
    },
  },
  { timestamps: true } // gives createdAt used for newest-first sorting
);

module.exports = mongoose.model('Announcement', announcementSchema);
