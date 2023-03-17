$(document).ready(function() {
  $(".add-to-cart").click(function() {
    var product = {
      title: $(this).siblings(".product-title").text(),
      price: $(this).siblings(".product-price").text(),
      image: $(this).siblings(".product-image").attr("src")
    };

    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
  });
});

$(document).ready(function() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var total = 0;
  var cartList = $("#cart-list");
  var totalPrice = $("#total-price");

  $.each(cart, function(index, item) {
    var cartItem = $("<li>").addClass("cart-item");
    var itemTitle = $("<h3>").text(item.title);
    var itemPrice = $("<p>").text(item.price);
    var removeButton = $("<button>").addClass("remove-item").text("Sil");

    cartItem.append(itemTitle, itemPrice, removeButton);
    cartList.append(cartItem);

    total += parseFloat(item.price);
  });

  totalPrice.text(total.toFixed(2));
  
  localStorage.setItem("cart", JSON.stringify(cart));
  
  $(".remove-item").click(function() {
    var item = $(this).closest(".cart-item");
    var price = item.find("p").text();
    var index = cart.findIndex(function(cartItem) {
      return cartItem.price === price;
    });

    cart.splice(index, 1);
    item.remove();

    total -= parseFloat(price);
    totalPrice.text(total.toFixed(2));
    
    localStorage.setItem("cart", JSON.stringify(cart));
  });
});

$(document).ready(function() {
  displayProducts();
  addToCart();
});

function displayProducts() {
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
}

function addToCart() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var total = 0;

  $(document).on("click", ".add-to-cart", function() {
    // Ürün bilgilerini al
    var product = $(this).closest(".product");
    var title = product.find("h2").text();
    var price = product.find("p").text();
    var image = product.find("img").attr("src");

    // Add the product to the cart
    cart.push({title: title, price: price, image: image});

    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Sepete eklenen ürünü göstermek için bir li öğesi oluşturun
    // Her ürün için bir li öğesi oluşturun ve sepete ekleyin
    var cartItem = $("<li>").addClass("cart-item");
    var itemTitle = $("<h3>").text(item.title);
    var itemPrice = $("<p>").text(item.price);
    var itemImage = $("<img>").attr("src", image);
    var removeButton = $("<button>").addClass("remove-item").text("Sil");
    
    cartItem.append(itemTitle, itemPrice, itemImage, removeButton);
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
}
