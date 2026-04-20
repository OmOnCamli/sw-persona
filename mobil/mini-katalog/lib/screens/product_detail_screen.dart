import 'package:flutter/material.dart';

import '../main.dart';
import '../models/product.dart';
import '../widgets/cart_badge_button.dart';
import 'cart_screen.dart';

class ProductDetailScreen extends StatelessWidget {
  const ProductDetailScreen({
    super.key,
    required this.product,
    required this.cartController,
  });

  static const routeName = '/detail';

  final Product product;
  final CartController cartController;

  @override
  Widget build(BuildContext context) {
    final isWide = MediaQuery.of(context).size.width >= 900;

    return Scaffold(
      body: SafeArea(
        child: ListenableBuilder(
          listenable: cartController,
          builder: (context, _) {
            return CustomScrollView(
              slivers: [
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                  sliver: SliverToBoxAdapter(
                    child: Row(
                      children: [
                        IconButton.filledTonal(
                          onPressed: () => Navigator.pop(context),
                          icon: const Icon(Icons.arrow_back_rounded),
                        ),
                        const Spacer(),
                        CartBadgeButton(
                          count: cartController.totalItems,
                          onPressed: () {
                            Navigator.pushNamed(context, CartScreen.routeName);
                          },
                        ),
                      ],
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
                  sliver: SliverToBoxAdapter(
                    child: isWide
                        ? Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: _ImagePanel(product: product),
                              ),
                              const SizedBox(width: 24),
                              Expanded(
                                child: _DetailPanel(
                                  product: product,
                                  cartController: cartController,
                                ),
                              ),
                            ],
                          )
                        : Column(
                            children: [
                              _ImagePanel(product: product),
                              const SizedBox(height: 20),
                              _DetailPanel(
                                product: product,
                                cartController: cartController,
                              ),
                            ],
                          ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _ImagePanel extends StatelessWidget {
  const _ImagePanel({required this.product});

  final Product product;

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minHeight: 320),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(32),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            product.accentColor.withOpacity(0.95),
            const Color(0xFF172121),
          ],
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            top: 18,
            left: 18,
            child: Chip(
              label: Text(product.category),
              backgroundColor: Colors.white.withOpacity(0.16),
              labelStyle: const TextStyle(color: Colors.white),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: Center(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(28),
                child: Image.network(
                  product.imageUrl,
                  height: 300,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    height: 300,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(28),
                    ),
                    child: const Icon(
                      Icons.image_not_supported_rounded,
                      color: Colors.white,
                      size: 56,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _DetailPanel extends StatelessWidget {
  const _DetailPanel({
    required this.product,
    required this.cartController,
  });

  final Product product;
  final CartController cartController;

  @override
  Widget build(BuildContext context) {
    final quantity = cartController.quantityFor(product);

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            product.brand.toUpperCase(),
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  color: product.accentColor,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.2,
                ),
          ),
          const SizedBox(height: 10),
          Text(
            product.title,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w900,
                ),
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              _InfoPill(icon: Icons.star_rounded, text: '${product.rating} puan'),
              _InfoPill(icon: Icons.inventory_2_rounded, text: '${product.stock} stok'),
              _InfoPill(icon: Icons.local_shipping_rounded, text: 'Hizli teslimat'),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            product.description,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  height: 1.55,
                  color: const Color(0xFF4B5563),
                ),
          ),
          const SizedBox(height: 28),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: const Color(0xFFF5F7FB),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Fiyat'),
                      const SizedBox(height: 6),
                      Text(
                        product.formattedPrice,
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.w900,
                            ),
                      ),
                    ],
                  ),
                ),
                if (quantity > 0)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: product.accentColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Text('Sepette: $quantity'),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: FilledButton.icon(
                  onPressed: () => cartController.add(product),
                  style: FilledButton.styleFrom(
                    backgroundColor: product.accentColor,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                  ),
                  icon: const Icon(Icons.add_shopping_cart_rounded),
                  label: const Text('Sepete Ekle'),
                ),
              ),
              const SizedBox(width: 12),
              IconButton.filledTonal(
                onPressed: quantity > 0 ? () => cartController.remove(product) : null,
                icon: const Icon(Icons.remove_rounded),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _InfoPill extends StatelessWidget {
  const _InfoPill({
    required this.icon,
    required this.text,
  });

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F7FB),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 18),
          const SizedBox(width: 8),
          Text(text),
        ],
      ),
    );
  }
}
