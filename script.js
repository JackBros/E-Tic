$(document).ready(function() {
  $('.panel-collapse').on('show.bs.collapse', function() {
    $('.ivy').show();
  });

  $('.panel-collapse').on('hide.bs.collapse', function() {
    $('.ivy').hide();
  });
});


$(document).ready(function() {
  $('#show-cart').click(function() {
    $('#cart').toggleClass('open');
  });

  $('.add-to-cart').click(function() {
    // add item to cart
    $('#feedback').addClass('show');
    setTimeout(function() {
      $('#feedback').removeClass('show');
    }, 2000);
  });
});


$(document).ready(function() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var total = 0;
  var cartList = $("#cart-list");
  var totalPrice = $("#total-price");

  $.each(cart, function(_, item) { // Changed "index" to "_" as it is unused
    var cartItem = $("<li>").addClass("cart-item");
    var itemTitle = $("<h3>")
      .text(item.title)
      .css("margin-right", "10px")
      .css("background-color", "lightblue");
    var itemPrice = $("<p>")
      .text(item.price + "₺")
      .css("margin-right", "10px")
      .css("background-color", "lightblue");
    var itemImage = $("<img>").attr("src", item.image);
    var itemQuantity = $("<span>")
      .addClass("quantity")
      .text("x " + item.quantity)
      .css("background-color", "lightblue");
    var removeButton = $("<button>")
      .addClass("remove-item")
      .text("-")
      .css({
        backgroundColor: "#E53935",
        color: "#FFFFFF",
        border: "none",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "10px"
      });
    var increaseButton = $("<button>")
      .addClass("increase-item")
      .text("+")
      .css({
        backgroundColor: "#43A047",
        color: "#FFFFFF",
        border: "none",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "10px"
      });
    var removeAllButton = $("<button>")
      .addClass("remove-all-items")
      .html('<span class="ui-icon ui-icon-trash"></span>')
      .css({
        backgroundColor: "transparent",
        color: "#FFB900",
        border: "none",
        padding: "15px",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "24px",
        boxShadow: "none"
      });

    increaseButton.click(function() {
      item.quantity += 1;
      itemQuantity.text(" x " + item.quantity);
      total += parseFloat(item.price);
      totalPrice.text(total.toFixed(2));
      localStorage.setItem("cart", JSON.stringify(cart));
    });

    removeAllButton.click(function() {
      total -= parseFloat(item.price) * item.quantity;
      cart.splice(_, 1); // Changed "index" to "_"
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
    var title = item.find("h3").text();
    var index = cart.findIndex(function(cartItem) {
      return cartItem.title === title;
    });

    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      item.find(".quantity").text(" x " + cart[index].quantity);
    } else {
      cart.splice(index, 1);
      item.remove();
    }

    total = 0;
    $.each(cart, function(_, item) { // Changed "index" to "_" as it is unused
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
        var description = $("<p>").text(product.description.slice(0, 100) + "...");
        var price = $("<p>").text(product.price + " TL");
        var image = $("<img>").attr("src", product.image);

        var button = $("<button>").addClass("add-to-cart").text("Sepete Ekle");

        var contentDiv = $("<div>").addClass("product-content");
        contentDiv.append(title, description, price);
        
        li.append(image, contentDiv);
        li.append(button);
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
  var cartList = $("#cart-list");
  var totalPrice = $("#total-price");

  $(document).on("click", ".add-to-cart", function() {
    // Ürün bilgilerini al
    var product = $(this).closest(".product");
    var title = product.find("h2").text();
    var price = parseFloat(product.find("p").text().replace(" TL", ""));
    var image = product.find("img").attr("src");

    // Sepete eklenen ürünü kontrol et
    var index = cart.findIndex(function(item) {
      return item.title === title;
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
      var itemQuantity = $("<span>").addClass("quantity").text(" x 1");
      var removeButton = $("<button>").addClass("remove-item").text("Sil");
      
      cartItem.append(itemTitle, itemPrice, itemImage, itemQuantity, removeButton);

      cartList.append(cartItem);
    }

    $("#feedback").addClass("show");

    setTimeout(function() {
      $("#feedback").removeClass("show");
    }, 2000);
    

    // Toplam fiyatı hesapla
    total = 0;
    $.each(cart, function(_, item) {
      total += parseFloat(item.price) * item.quantity;
    });
    totalPrice.text(total.toFixed(2));

    // Güncellenmiş sepeti localStorage'a kaydet
    localStorage.setItem("cart", JSON.stringify(cart));
  });
}
