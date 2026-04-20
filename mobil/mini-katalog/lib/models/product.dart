import 'package:flutter/material.dart';

class Product {
  const Product({
    required this.id,
    required this.title,
    required this.category,
    required this.price,
    required this.rating,
    required this.stock,
    required this.brand,
    required this.imageUrl,
    required this.description,
    required this.accentHex,
  });

  final int id;
  final String title;
  final String category;
  final double price;
  final double rating;
  final int stock;
  final String brand;
  final String imageUrl;
  final String description;
  final String accentHex;

  Color get accentColor => _hexToColor(accentHex);

  String get formattedPrice => '${price.toStringAsFixed(0)} TL';

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as int,
      title: json['title'] as String,
      category: json['category'] as String,
      price: (json['price'] as num).toDouble(),
      rating: (json['rating'] as num).toDouble(),
      stock: json['stock'] as int,
      brand: json['brand'] as String,
      imageUrl: json['imageUrl'] as String,
      description: json['description'] as String,
      accentHex: json['accentHex'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'category': category,
      'price': price,
      'rating': rating,
      'stock': stock,
      'brand': brand,
      'imageUrl': imageUrl,
      'description': description,
      'accentHex': accentHex,
    };
  }

  static Color _hexToColor(String hex) {
    final sanitized = hex.replaceAll('#', '');
    return Color(int.parse('FF$sanitized', radix: 16));
  }
}
