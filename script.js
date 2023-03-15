$.ajax({
  url: "https://fakestoreapi.com/products",
  method: "GET",
  success: function(data) {
    var productsList = $("#products-list");

    $.each(data, function(index, product) {
      var li = $("<li>").addClass("product");
      var title = $("<h2>").text(product.title);
      var price = $("<p>").text(product.price);
      var image = $("<img>").attr("src", product.image);

      var button = $("<button>").addClass("add-to-cart").text("Sepete Ekle");

      li.append(title, price, image, button);
      productsList.append(li);
    });
  },
  error: function(error) {
    console.log(error);
  }
});
/// Sepete ürün ekleme işlemi tamamlandıktan sonra, sepet içeriğini kaydetmek için localStorage kullanın
var cart = [];
var total = 0;

$(document).on("click", ".add-to-cart", function() {
  // Ürün bilgilerini al
  var product = $(this).closest(".product");
  var title = product.find("h2").text();
  var price = product.find("p").text();

  // Sepete eklenen ürünü göstermek için bir li öğesi oluşturun
  // Her ürün için bir li öğesi oluşturun ve sepete ekleyin
  var cartItem = $("<li>").addClass("cart-item");
  var itemTitle = $("<h3>").text(title);
  var itemPrice = $("<p>").text(price);
  var removeButton = $("<button>").addClass("remove-item").text("Sil");

  cartItem.append(itemTitle, itemPrice, removeButton);
  $("#cart-list").append(cartItem);

  // Toplam fiyatı hesapla
  total += parseFloat(price);
  $("#total-price").text(total.toFixed(2));

  // Sepete eklenen ürünü cart dizisine ekle
  cart.push({title: title, price: price});

  // Sepet içeriğini localStorage'dan alın, yeni ürünü ekleyin ve güncellenmiş sepeti localStorage'a kaydedin
  var cartInStorage = JSON.parse(localStorage.getItem("cart")) || [];
  cartInStorage.push({title: title, price: price});
  localStorage.setItem("cart", JSON.stringify(cartInStorage));
});

