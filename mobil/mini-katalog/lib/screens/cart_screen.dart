import 'package:flutter/material.dart';

import '../main.dart';
import '../models/product.dart';
import '../services/product_repository.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({
    super.key,
    required this.repository,
    required this.cartController,
  });

  static const routeName = '/cart';

  final ProductRepository repository;
  final CartController cartController;

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  late Future<List<Product>> _productsFuture;

  @override
  void initState() {
    super.initState();
    _productsFuture = widget.repository.fetchProducts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ListenableBuilder(
          listenable: widget.cartController,
          builder: (context, _) {
            return FutureBuilder<List<Product>>(
              future: _productsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Text(
                        'Sepet yuklenirken bir hata olustu.\n${snapshot.error}',
                        textAlign: TextAlign.center,
                      ),
                    ),
                  );
                }

                final products = snapshot.data ?? <Product>[];
                final cartProducts = products
                    .where((product) => widget.cartController.quantityFor(product) > 0)
                    .toList();
                final totalPrice = cartProducts.fold<double>(
                  0,
                  (sum, product) =>
                      sum + product.price * widget.cartController.quantityFor(product),
                );

                if (cartProducts.isEmpty) {
                  return _EmptyCart(
                    onContinueShopping: () => Navigator.pop(context),
                  );
                }

                return CustomScrollView(
                  slivers: [
                    SliverPadding(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                      sliver: SliverToBoxAdapter(
                        child: Row(
                          children: [
                            IconButton.filledTonal(
                              onPressed: () => Navigator.pop(context),
                              icon: const Icon(Icons.arrow_back_rounded),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Sepetim',
                                    style: Theme.of(context)
                                        .textTheme
                                        .headlineSmall
                                        ?.copyWith(fontWeight: FontWeight.w900),
                                  ),
                                  Text('${widget.cartController.totalItems} urun eklendi'),
                                ],
                              ),
                            ),
                            TextButton(
                              onPressed: widget.cartController.clear,
                              child: const Text('Temizle'),
                            ),
                          ],
                        ),
                      ),
                    ),
                    SliverPadding(
                      padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
                      sliver: SliverToBoxAdapter(
                        child: _CartSummary(
                          totalItems: widget.cartController.totalItems,
                          totalPrice: totalPrice,
                        ),
                      ),
                    ),
                    SliverPadding(
                      padding: const EdgeInsets.fromLTRB(20, 0, 20, 140),
                      sliver: SliverList(
                        delegate: SliverChildBuilderDelegate(
                          (context, index) {
                            final product = cartProducts[index];
                            final quantity = widget.cartController.quantityFor(product);

                            return Padding(
                              padding: EdgeInsets.only(
                                bottom: index == cartProducts.length - 1 ? 0 : 14,
                              ),
                              child: _CartItemCard(
                                product: product,
                                quantity: quantity,
                                onAdd: () => widget.cartController.add(product),
                                onRemove: () => widget.cartController.remove(product),
                              ),
                            );
                          },
                          childCount: cartProducts.length,
                        ),
                      ),
                    ),
                  ],
                );
              },
            );
          },
        ),
      ),
      bottomNavigationBar: ListenableBuilder(
        listenable: widget.cartController,
        builder: (context, _) {
          if (widget.cartController.isEmpty) {
            return const SizedBox.shrink();
          }

          return SafeArea(
            minimum: const EdgeInsets.fromLTRB(20, 12, 20, 20),
            child: Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(28),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Onay ozeti'),
                        const SizedBox(height: 4),
                        Text(
                          '${widget.cartController.totalItems} urun hazir',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w800,
                              ),
                        ),
                      ],
                    ),
                  ),
                  FilledButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Siparis ozeti demo amacli hazirlandi.'),
                        ),
                      );
                    },
                    child: const Text('Siparisi Tamamla'),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _CartSummary extends StatelessWidget {
  const _CartSummary({
    required this.totalItems,
    required this.totalPrice,
  });

  final int totalItems;
  final double totalPrice;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Row(
        children: [
          Expanded(
            child: _SummaryBlock(
              label: 'Toplam urun',
              value: '$totalItems',
            ),
          ),
          Expanded(
            child: _SummaryBlock(
              label: 'Ara toplam',
              value: '${totalPrice.toStringAsFixed(0)} TL',
            ),
          ),
        ],
      ),
    );
  }
}

class _SummaryBlock extends StatelessWidget {
  const _SummaryBlock({
    required this.label,
    required this.value,
  });

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: const Color(0xFF6B7280),
              ),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w900,
              ),
        ),
      ],
    );
  }
}

class _CartItemCard extends StatelessWidget {
  const _CartItemCard({
    required this.product,
    required this.quantity,
    required this.onAdd,
    required this.onRemove,
  });

  final Product product;
  final int quantity;
  final VoidCallback onAdd;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(22),
              child: SizedBox(
                width: 92,
                height: 92,
                child: Image.network(
                  product.imageUrl,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    color: product.accentColor.withOpacity(0.15),
                    alignment: Alignment.center,
                    child: Icon(
                      Icons.image_not_supported_rounded,
                      color: product.accentColor,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.brand,
                    style: Theme.of(context).textTheme.labelMedium?.copyWith(
                          color: const Color(0xFF6B7280),
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    product.title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${(product.price * quantity).toStringAsFixed(0)} TL',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w900,
                        ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      IconButton.filledTonal(
                        onPressed: onRemove,
                        icon: const Icon(Icons.remove_rounded),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        child: Text(
                          '$quantity',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w800,
                              ),
                        ),
                      ),
                      IconButton.filled(
                        onPressed: onAdd,
                        style: IconButton.styleFrom(
                          backgroundColor: product.accentColor,
                        ),
                        icon: const Icon(Icons.add_rounded),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyCart extends StatelessWidget {
  const _EmptyCart({required this.onContinueShopping});

  final VoidCallback onContinueShopping;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Container(
          padding: const EdgeInsets.all(28),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(32),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 84,
                height: 84,
                decoration: BoxDecoration(
                  color: const Color(0xFF0E7490).withOpacity(0.12),
                  borderRadius: BorderRadius.circular(28),
                ),
                child: const Icon(Icons.shopping_cart_checkout_rounded, size: 42),
              ),
              const SizedBox(height: 18),
              Text(
                'Sepetin su an bos',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Begendigin urunleri sepete eklediginde burada liste halinde goreceksin.',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: const Color(0xFF6B7280),
                      height: 1.5,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              FilledButton(
                onPressed: onContinueShopping,
                child: const Text('Alisverise Don'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
