const Product = require('../../models/product.model');

exports.create = (productData) => {
  const product = new Product(productData);
  return product.save();
};

exports.findAll = (filterRule = {}) => Product.find(filterRule);

exports.findOne = (id) => Product.findById(id);

exports.update = (id, updatedData) => Product.findByIdAndUpdate(id, updatedData, {
  new: true, useFindAndModify: false,
});

exports.delete = (id) => Product.findByIdAndDelete(id);