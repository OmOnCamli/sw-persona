import 'package:flutter/material.dart';

import 'core/app_theme.dart';
import 'models/product.dart';
import 'screens/cart_screen.dart';
import 'screens/home_screen.dart';
import 'screens/product_detail_screen.dart';
import 'services/product_repository.dart';

void main() {
  runApp(const CatalogApp());
}

class CatalogApp extends StatefulWidget {
  const CatalogApp({super.key});

  @override
  State<CatalogApp> createState() => _CatalogAppState();
}

class _CatalogAppState extends State<CatalogApp> {
  final CartController _cartController = CartController();
  final ProductRepository _repository = const ProductRepository();

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _cartController,
      builder: (context, _) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Mini Katalog',
          theme: AppTheme.theme,
          initialRoute: HomeScreen.routeName,
          onGenerateRoute: (settings) {
            switch (settings.name) {
              case HomeScreen.routeName:
                return MaterialPageRoute(
                  builder: (_) => HomeScreen(
                    repository: _repository,
                    cartController: _cartController,
                  ),
                );
              case ProductDetailScreen.routeName:
                final product = settings.arguments as Product;
                return MaterialPageRoute(
                  builder: (_) => ProductDetailScreen(
                    product: product,
                    cartController: _cartController,
                  ),
                );
              case CartScreen.routeName:
                return MaterialPageRoute(
                  builder: (_) => CartScreen(
                    repository: _repository,
                    cartController: _cartController,
                  ),
                );
              default:
                return MaterialPageRoute(
                  builder: (_) => HomeScreen(
                    repository: _repository,
                    cartController: _cartController,
                  ),
                );
            }
          },
        );
      },
    );
  }
}

class CartController extends ChangeNotifier {
  final Map<int, int> _items = {};

  Map<int, int> get items => Map.unmodifiable(_items);

  int get totalItems =>
      _items.values.fold<int>(0, (total, quantity) => total + quantity);

  bool get isEmpty => _items.isEmpty;

  int quantityFor(Product product) => _items[product.id] ?? 0;

  void add(Product product) {
    _items.update(product.id, (value) => value + 1, ifAbsent: () => 1);
    notifyListeners();
  }

  void remove(Product product) {
    if (!_items.containsKey(product.id)) {
      return;
    }

    final current = _items[product.id]!;
    if (current <= 1) {
      _items.remove(product.id);
    } else {
      _items[product.id] = current - 1;
    }
    notifyListeners();
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }
}
