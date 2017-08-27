const mongoose      = require('mongoose');
mongoose.Promise    = require('bluebird');
const Schema        = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/snippetData');

const snippetSchema = new mongoose.Schema({
  title: {type: String, required: true},
  snippet: {type: String, required: true},
  notes: String,
  language: {type: String, required: true},
  tags: {type: String, required: true}
});


const Snippet = mongoose.model("Snippet", snippetSchema);

module.exports = Snippet;
