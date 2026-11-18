import Product from '../models/Product.js';

export async function listProducts(_req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (error) { return next(error); }
}

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ message: 'Product created', product });
  } catch (error) { return next(error); }
}
