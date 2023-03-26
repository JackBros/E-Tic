$(document).ready(function() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var total = 0;
  var cartList = $("#cart-list");
  var totalPrice = $("#total-price");

  $.each(cart, function(index, item) {
    var cartItem = $("<li>").addClass("cart-item");
    var itemTitle = $("<h3>").text(item.title);
    var itemPrice = $("<p>").text(item.price);
    var itemImage = $("<img>").attr("src", item.image);
    var itemQuantity = $("<span>").addClass("quantity").text(" x " + item.quantity);
    var removeButton = $("<button>").addClass("remove-item").text("Azalt");
    var increaseButton = $("<button>").addClass("increase-item").text("Artır");
    var removeAllButton = $("<button>").addClass("remove-all-items").text("Hepsini Sil");

   1
    increaseButton.click(function() {
      item.quantity += 1;
      itemQuantity.text(" x " + item.quantity);
      total += parseFloat(item.price);
      totalPrice.text(total.toFixed(2));
      localStorage.setItem("cart", JSON.stringify(cart));
    });
    
    removeAllButton.click(function() {
      total -= parseFloat(item.price) * item.quantity;
      cart.splice(index, 1);
      cartItem.remove();
      totalPrice.text(total.toFixed(2));
      localStorage.setItem("cart", JSON.stringify(cart));
    });
    
    cartItem.append(itemImage, itemTitle, itemQuantity, itemPrice, removeButton, increaseButton, removeAllButton);
    cartList.append(cartItem);
    
    total += parseFloat(item.price) * item.quantity;
  });

  totalPrice.text(total.toFixed(2));
  
  localStorage.setItem("cart", JSON.stringify(cart));
  
  $(".remove-item").click(function() {
    var item = $(this).closest(".cart-item");
    var price = item.find("p").text();
    var index = cart.findIndex(function(cartItem) {
      return cartItem.price === price;
    });
  
    if (cart[index].quantity > 1) {
      
      cart[index].quantity -= 1;
      item.find(".quantity").text(" x " + cart[index].quantity);
    } else {
     
      cart.splice(index, 1);
      item.remove();
    }
  
    total = 0;
    $.each(cart, function(index, item) {
      total += parseFloat(item.price) * item.quantity;
    });
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

    // Sepete eklenen ürünü kontrol et
    var index = cart.findIndex(function(item) {
      return item.title === title && item.price === price;
    });

    if (index !== -1) {
      // Ürün zaten listede var, adetini artır
      cart[index].quantity += 1;
      // Sepet listesindeki ilgili ürünün adetini güncelle
      $(".cart-item:contains('" + title + "') .quantity").text(" x " + cart[index].quantity);
    } else {
      // Ürünü listeye ekle
      cart.push({title: title, price: price, image: image, quantity: 1});
      // Sepete eklenen ürünü göstermek için bir li öğesi oluşturun
      var cartItem = $("<li>").addClass("cart-item");
      var itemTitle = $("<h3>").text(title);
      var itemPrice = $("<p>").text(price);
      var itemImage = $("<img>").attr("src", image);
      var itemQuantity = $("<span>").addClass("quantity").text(quantity);
      var removeButton = $("<button>").addClass("remove-item").text("Sil");
      
      cartItem.append(itemTitle, itemPrice, itemImage, itemQuantity, removeButton);

      $("#cart-list").append(cartItem);
    }

    // Toplam fiyatı hesapla
    total = 0;
    $.each(cart, function(index, item) {
      total += parseFloat(item.price) * item.quantity;
    });
    $("#total-price").text(total.toFixed(2));

    // Güncellenmiş sepeti localStorage'a kaydet
    localStorage.setItem("cart", JSON.stringify(cart));
  });
}
