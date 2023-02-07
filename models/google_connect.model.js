const mongoose = require('mongoose');


const Google_connectSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      trim: true,
    },
    sub_id: {
      type: String,
      required: true,
      trim: true,
    },
    store_id: {
      type: String,
      required: true,
      trim: true,
    },
    rd_enabled: {
      type: Boolean,
      trim: true,
    },
    server: {
      type: String,
      trim: true,
    },
    ttl: {
      type: String,
      trim: true,
    },
    access_token: {
      type: String,
      trim: true,
    },
    connection_id: {
      type: String,
      trim: true,
    },
    fb_page_id: {
      type: String,
      trim: true,
    },
    fb_user_id: {
      type: String,
      trim: true,
    },
    token_type: {
      type: String,
      trim: true,
    },
    fb_page_name: {
      type: String,
      trim: true,
    },
    user_access_token_expire: {
      type: String,
      trim: true,
    },
    page_access_token: {
      type: String,
      trim: true,
    },
    facebook_enabled: {
      type: Boolean,
      trim: true,
    },
    instagram_enabled: {
      type: Boolean,
      trim: true,
    },
    instagram_user_id: {
      type: String,
      trim: true,
    },
    google_enabled: {
      type: Boolean,
      trim: true,
    },
    google_user_id: {
      type: String,
      trim: true,
    },
    google_access_token: {
      type: String,
      trim: true,
    },
    google_id_token: {
      type: String,
      trim: true,
    },
  }
);



const GoogleConnectModel = mongoose.model('config', Google_connectSchema);

module.exports = GoogleConnectModel;
