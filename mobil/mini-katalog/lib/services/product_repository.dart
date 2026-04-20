import 'dart:convert';

import 'package:flutter/services.dart';

import '../models/product.dart';

class ProductRepository {
  const ProductRepository();

  Future<List<Product>> fetchProducts() async {
    final jsonString = await rootBundle.loadString('assets/data/products.json');
    final List<dynamic> decoded = json.decode(jsonString) as List<dynamic>;

    return decoded
        .map((item) => Product.fromJson(item as Map<String, dynamic>))
        .toList();
  }
}
