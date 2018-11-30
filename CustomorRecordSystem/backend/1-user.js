
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BearSchema = new Schema({
  name: {type: String, required: true},
  title: String,
  sex: String,
  startDate: Date,
  officePhone: String,
  cellphone: String,
  SMS: String,
  Email: String,
  imgUrl: String,
  //managerId: Schema.Types.ObjectId,
  manager: { type: String, default: null },
  directReports: { type: [String], defulat: []}
});

module.exports = mongoose.model('User', BearSchema,'User');

