# Mini Katalog Uygulamasi

TNC Group Software Persona yazilim staji bitirme projesi icin, Flutter ile gelistirilmis modern ve responsive mini katalog uygulamasi.

## Ozellikler

- Responsive ana sayfa ve urun grid yapisi
- Arama ve kategori filtreleme
- Urun detay sayfasi
- Basit sepet simulasyonu
- Yerel JSON verisi ile calisma
- Named route ve route argument kullanimi

## Klasor Yapisi

```text
lib/
  core/
  models/
  screens/
  services/
  widgets/
assets/
  data/
```

## Kullanilan Flutter Surumu

Bu proje Flutter 3.22+ ve Dart 3.3+ hedeflenerek hazirlandi.

## Calistirma Adimlari

1. Flutter SDK kurulu oldugundan emin olun.
2. Proje klasorunde `flutter pub get` komutunu calistirin.
3. Emulator veya fiziksel cihaz baglayin.
4. `flutter run` komutu ile uygulamayi baslatin.

## Notlar

- Bu ortamda `flutter` komutu kurulu olmadigi icin derleme dogrulamasi yapilamadi.
- Veri kaynagi olarak yerel JSON kullanilmistir; bu sayede proje demo icin kendi basina calisir.
