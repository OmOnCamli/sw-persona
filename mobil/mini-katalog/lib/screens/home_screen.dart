import 'package:flutter/material.dart';

import '../main.dart';
import '../models/product.dart';
import '../services/product_repository.dart';
import '../widgets/cart_badge_button.dart';
import '../widgets/product_card.dart';
import 'cart_screen.dart';
import 'product_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({
    super.key,
    required this.repository,
    required this.cartController,
  });

  static const routeName = '/';

  final ProductRepository repository;
  final CartController cartController;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<List<Product>> _productsFuture;
  String _query = '';
  String _selectedCategory = 'Tum Urunler';

  @override
  void initState() {
    super.initState();
    _productsFuture = widget.repository.fetchProducts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: FutureBuilder<List<Product>>(
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
                    'Urunler yuklenirken bir hata olustu.\n${snapshot.error}',
                    textAlign: TextAlign.center,
                  ),
                ),
              );
            }

            final products = snapshot.data ?? <Product>[];
            final categories = <String>{
              'Tum Urunler',
              ...products.map((product) => product.category),
            }.toList();
            final filteredProducts = _filterProducts(products);

            return CustomScrollView(
              slivers: [
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                  sliver: SliverToBoxAdapter(
                    child: _TopBar(cartController: widget.cartController),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                  sliver: SliverToBoxAdapter(
                    child: TextField(
                      onChanged: (value) => setState(() => _query = value),
                      decoration: const InputDecoration(
                        hintText: 'Urun, marka veya kategori ara',
                        prefixIcon: Icon(Icons.search_rounded),
                      ),
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(20, 18, 20, 0),
                  sliver: SliverToBoxAdapter(
                    child: SizedBox(
                      height: 42,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemBuilder: (context, index) {
                          final category = categories[index];
                          final isSelected = category == _selectedCategory;

                          return ChoiceChip(
                            label: Text(category),
                            selected: isSelected,
                            onSelected: (_) {
                              setState(() => _selectedCategory = category);
                            },
                          );
                        },
                        separatorBuilder: (_, __) => const SizedBox(width: 10),
                        itemCount: categories.length,
                      ),
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(20, 22, 20, 12),
                  sliver: SliverToBoxAdapter(
                    child: _SectionHeader(resultCount: filteredProducts.length),
                  ),
                ),
                if (filteredProducts.isEmpty)
                  const SliverPadding(
                    padding: EdgeInsets.fromLTRB(20, 12, 20, 24),
                    sliver: SliverToBoxAdapter(
                      child: _EmptyState(),
                    ),
                  )
                else
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                    sliver: SliverGrid(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final product = filteredProducts[index];
                          return ProductCard(
                            product: product,
                            quantity: widget.cartController.quantityFor(product),
                            onTap: () {
                              Navigator.pushNamed(
                                context,
                                ProductDetailScreen.routeName,
                                arguments: product,
                              );
                            },
                            onAddToCart: () {
                              widget.cartController.add(product);
                            },
                          );
                        },
                        childCount: filteredProducts.length,
                      ),
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: _crossAxisCount(context),
                        mainAxisSpacing: 18,
                        crossAxisSpacing: 18,
                        childAspectRatio: _childAspectRatio(context),
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

  List<Product> _filterProducts(List<Product> products) {
    return products.where((product) {
      final matchesCategory =
          _selectedCategory == 'Tum Urunler' ||
          product.category == _selectedCategory;
      final query = _query.toLowerCase();
      final matchesQuery = query.isEmpty ||
          product.title.toLowerCase().contains(query) ||
          product.brand.toLowerCase().contains(query) ||
          product.category.toLowerCase().contains(query);
      return matchesCategory && matchesQuery;
    }).toList();
  }

  int _crossAxisCount(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width >= 1200) return 4;
    if (width >= 900) return 3;
    if (width >= 600) return 2;
    return 1;
  }

  double _childAspectRatio(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width >= 1200) return 0.92;
    if (width >= 900) return 0.84;
    if (width >= 600) return 0.82;
    return 1.05;
  }
}

class _TopBar extends StatelessWidget {
  const _TopBar({required this.cartController});

  final CartController cartController;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mini Katalog',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
              const SizedBox(height: 4),
              Text(
                'Modern, sade ve responsive urun deneyimi',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: const Color(0xFF5F6C7B),
                    ),
              ),
            ],
          ),
        ),
        ListenableBuilder(
          listenable: cartController,
          builder: (context, _) {
            return CartBadgeButton(
              count: cartController.totalItems,
              onPressed: () {
                Navigator.pushNamed(context, CartScreen.routeName);
              },
            );
          },
        ),
      ],
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.resultCount});

  final int resultCount;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          'Kesfet',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w800,
              ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(999),
          ),
          child: Text('$resultCount urun'),
        ),
      ],
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Column(
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: const Color(0xFF0E7490).withOpacity(0.1),
              borderRadius: BorderRadius.circular(24),
            ),
            child: const Icon(Icons.search_off_rounded, size: 34),
          ),
          const SizedBox(height: 16),
          Text(
            'Aramaniza uygun urun bulunamadi',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Farkli bir kategori secmeyi veya arama metnini sadeletirmeyi deneyin.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: const Color(0xFF6B7280),
                  height: 1.5,
                ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
