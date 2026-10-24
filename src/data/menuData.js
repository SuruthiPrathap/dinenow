const EXT = ".avif"; // default extension for photos written without one

// food(file, name, price, "ingredient 1, ingredient 2, ...", "optional description")
// The category folder is added at the bottom of this file.
const food = (file, name, price, ingredients = "", desc = "") => {
  const list = ingredients
    ? ingredients.split(",").map((i) => i.trim())
    : [];
  return {
    image: file.includes(".") ? file : file + EXT,
    name,
    price: "₹" + price,
    ingredients: list,
    desc:
      desc ||
      (list.length
        ? `Freshly prepared ${name} made with ${list.slice(0, 3).join(", ").toLowerCase()} and more.`
        : "")
  };
};

const raw = {
  fastfood: {
    title: "Fast Food",
    hero: "/images/fastfood/hero.jpg",
    items: [
      food("burger.avif", "Burger", 150, "Burger bun, Veg patty, Lettuce, Tomato, Cheese, Special sauce"),
      food("pizz.avif", "Pizza", 250, "Pizza base, Tomato sauce, Mozzarella, Capsicum, Onion, Olives"),
      food("fries.avif", "Fries", 90, "Potato, Salt, Oil, Peri peri seasoning"),
      food("sandwich.avif", "Sandwich", 110, "Bread, Cucumber, Tomato, Cheese, Mint chutney"),
      food("nuggets.avif", "Chicken Nuggets", 180, "Chicken, Breadcrumbs, Egg, Spices, Dip sauce"),
      food("wrap.avif", "Veg Wrap", 130, "Tortilla, Mixed veggies, Mayo, Lettuce, Cheese"),
      food("hotdog.avif", "Hot Dog", 120, "Hot dog bun, Sausage, Mustard, Ketchup, Onion"),
      food("cheeseburger.avif", "Cheese Burger", 170, "Burger bun, Patty, Double cheese, Pickles, Sauce"),
      food("chickenburger.avif", "Chicken Burger", 190, "Burger bun, Crispy chicken, Lettuce, Mayo, Tomato"),
      food("friedchicken.avif", "Fried Chicken", 220, "Chicken, Flour coating, Spices, Buttermilk, Oil"),
      food("onionrings.avif", "Onion Rings", 100, "Onion, Flour, Breadcrumbs, Spices, Oil"),
      food("cheesefries.avif", "Cheese Fries", 130, "Potato, Cheese sauce, Jalapeno, Seasoning"),
      food("clubsandwich.avif", "Club Sandwich", 160, "Toasted bread, Chicken, Egg, Lettuce, Tomato, Mayo"),
      food("chickenroll.avif", "Chicken Roll", 140, "Roomali roti, Chicken, Onion, Sauce, Capsicum"),
      food("popcornchicken.jpg", "Popcorn Chicken", 170, "Chicken bites, Flour, Spices, Breadcrumbs, Oil"),
      // 5 new
      food("veggieburger.avif", "Veggie Burger", 140, "Burger bun, Aloo patty, Lettuce, Onion, Mint mayo"),
      food("paneerwrap.avif", "Paneer Wrap", 150, "Tortilla, Paneer, Onion, Capsicum, Mint chutney"),
      food("nachos.avif", "Loaded Nachos", 160, "Corn chips, Cheese sauce, Salsa, Jalapeno, Beans"),
      food("chickenwings.avif", "Chicken Wings", 210, "Chicken wings, Hot sauce, Garlic, Butter, Spices"),
      food("grilledsandwich", "Grilled Cheese Sandwich", 120, "Bread, Cheese, Butter, Oregano, Chilli flakes")
    ]
  },

  chinese: {
    title: "Chinese",
    hero: "/images/chinese/hero.jpg",
    items: [
      food("hakka.avif", "Hakka Noodles", 160, "Noodles, Cabbage, Carrot, Capsicum, Soy sauce, Garlic"),
      food("friedrice.avif", "Fried Rice", 170, "Basmati rice, Beans, Carrot, Soy sauce, Spring onion"),
      food("gobi.webp", "Gobi Manchurian", 150, "Cauliflower, Corn flour, Soy sauce, Garlic, Ginger, Chilli sauce"),
      food("momos.avif", "Momos", 120, "Flour wrapper, Cabbage, Carrot, Ginger, Garlic, Red chutney"),
      food("soup.avif", "Hot and Sour Soup", 100, "Vegetables, Vinegar, Pepper, Soy sauce, Corn flour"),
      food("roll.avif", "Spring Roll", 110, "Roll sheet, Cabbage, Carrot, Noodles, Spices, Oil"),
      food("chillichicken.jpg", "Chilli Chicken", 210, "Chicken, Capsicum, Onion, Green chilli, Soy sauce, Garlic"),
      food("chillipaneer.jpg", "Chilli Paneer", 190, "Paneer, Capsicum, Onion, Chilli sauce, Soy sauce"),
      food("schezwannoodles.avif", "Schezwan Noodles", 180, "Noodles, Schezwan sauce, Cabbage, Carrot, Garlic"),
      food("manchuriansoup.avif", "Manchurian Soup", 110, "Vegetable balls, Ginger, Garlic, Soy sauce, Spring onion"),
      food("dragonchicken.jpg", "Dragon Chicken", 230, "Chicken, Cashew, Dry chilli, Capsicum, Honey, Soy sauce"),
      food("eggfriedrice.avif", "Egg Fried Rice", 160, "Rice, Egg, Spring onion, Soy sauce, Pepper"),
      food("chickenlollipop.jpg", "Chicken Lollipop", 200, "Chicken winglets, Batter, Spices, Schezwan sauce"),
      food("honeychillipotato.jpg", "Honey Chilli Potato", 140, "Potato, Honey, Chilli flakes, Garlic, Sesame seeds"),
      food("sweetcornsoup.webp", "Sweet Corn Soup", 100, "Sweet corn, Vegetables, Pepper, Corn flour, Spring onion"),
      // 5 new
      food("chickenfriedrice.avif", "Chicken Fried Rice", 190, "Rice, Chicken, Egg, Soy sauce, Spring onion"),
      food("chickenmanchurian.avif", "Chicken Manchurian", 210, "Chicken, Corn flour, Soy sauce, Garlic, Ginger, Spring onion"),
      food("vegdimsum.avif", "Veg Dim Sum", 150, "Dumpling wrapper, Cabbage, Carrot, Mushroom, Soy sauce"),
      food("babycornchilli.jpg", "Crispy Chilli Baby Corn", 160, "Baby corn, Batter, Capsicum, Chilli sauce, Spring onion"),
      food("chickennoodles.avif", "Chicken Noodles", 190, "Noodles, Chicken, Cabbage, Carrot, Soy sauce, Pepper")
    ]
  },

  cafe: {
    title: "Cafe",
    hero: "/images/cafe/hero.jpg",
    items: [
      // 5 coffee varieties
      food("coffee.jpg", "Hot Coffee", 80, "Coffee decoction, Milk, Sugar"),
      food("cappuccino.jpg", "Cappuccino", 120, "Espresso, Steamed milk, Milk foam, Cocoa powder"),
      food("latte.jpg", "Cafe Latte", 130, "Espresso, Steamed milk, Light foam"),
      food("coldcoffee.jpg", "Cold Coffee", 130, "Coffee, Cold milk, Ice cream, Ice, Sugar"),
      food("espresso.jpg", "Espresso", 100, "Finely ground coffee, Hot water"),

      // 5 tea varieties
      food("tea.jpg", "Masala Tea", 50, "Tea leaves, Milk, Cardamom, Ginger, Sugar"),
      food("gingertea.avif", "Ginger Tea", 45, "Tea leaves, Fresh ginger, Milk, Sugar"),
      food("lemontea.avif", "Lemon Tea", 45, "Tea leaves, Lemon juice, Sugar, Hot water"),
      food("greentea.avif", "Green Tea", 60, "Green tea leaves, Hot water, Honey"),
      food("icedtea.avif", "Iced Tea", 70, "Black tea, Lemon, Ice, Sugar, Mint"),

      // 5 puff varieties
      food("vegpuff.jpg", "Veg Puff", 35, "Puff pastry, Potato, Carrot, Peas, Spices"),
      food("eggpuff.jpg", "Egg Puff", 40, "Puff pastry, Boiled egg, Onion masala"),
      food("chickenpuff.jpg", "Chicken Puff", 50, "Puff pastry, Chicken masala, Onion, Spices"),
      food("paneerpuff.jpg", "Paneer Puff", 45, "Puff pastry, Paneer, Capsicum, Spices"),
      food("mushroompuff.jpg", "Mushroom Puff", 45, "Puff pastry, Mushroom, Onion, Pepper"),

      // 5 shakes and coolers (new)
      food("chocolatemilkshake.avif", "Chocolate Milkshake", 140, "Milk, Chocolate syrup, Ice cream, Ice"),
      food("mangosmoothie.avif", "Mango Smoothie", 130, "Ripe mango, Yogurt, Honey, Ice"),
      food("strawberryshake.avif", "Strawberry Shake", 140, "Strawberry, Milk, Ice cream, Sugar"),
      food("limesoda.avif", "Fresh Lime Soda", 60, "Lime juice, Soda, Mint, Sugar, Ice"),
      food("coldbrew.avif", "Cold Brew Coffee", 150, "Cold brew coffee, Ice, Milk, Sugar syrup")
    ]
  },

  traditional: {
    title: "Traditional",
    hero: "/images/traditional/hero.jpg",
    items: [
      food("briyani.avif", "Chicken Biryani", 220, "Basmati rice, Chicken, Biryani masala, Mint, Ghee, Onion"),
      food("dosa.avif", "Masala Dosa", 90, "Dosa batter, Potato masala, Onion, Ghee, Chutney, Sambar"),
      food("idli.avif", "Idli Sambar", 60, "Rice, Urad dal, Sambar, Coconut chutney"),
      food("meals.avif", "South Indian Meals", 150, "Rice, Sambar, Rasam, Poriyal, Curd, Papad"),
      food("paneer.avif", "Paneer Butter Masala", 190, "Paneer, Tomato, Butter, Cream, Cashew, Spices"),
      food("parotta.jpg", "Parotta Salna", 100, "Maida, Egg, Oil, Salna gravy, Onion"),
      food("pongal.jpg", "Ven Pongal", 70, "Rice, Moong dal, Pepper, Cumin, Ghee, Cashew"),
      food("vada.jpg", "Medu Vada", 50, "Urad dal, Pepper, Curry leaves, Ginger, Oil"),
      food("kuzhipaniyaram.jpg", "Kuzhi Paniyaram", 70, "Idli batter, Onion, Mustard, Curry leaves, Chilli"),
      food("kozhukattai.jpg", "Kozhukattai", 60, "Rice flour, Coconut, Jaggery, Cardamom"),
      food("sambarrice.jpg", "Sambar Rice", 90, "Rice, Toor dal, Vegetables, Sambar powder, Ghee"),
      food("curdrice.jpg", "Curd Rice", 80, "Rice, Curd, Mustard, Curry leaves, Pomegranate"),
      food("lemonrice.jpg", "Lemon Rice", 80, "Rice, Lemon juice, Turmeric, Peanuts, Curry leaves"),
      food("rasamrice.jpg", "Rasam Rice", 85, "Rice, Tomato rasam, Pepper, Cumin, Garlic"),
      food("muttonbiryani.jpg", "Mutton Biryani", 300, "Basmati rice, Mutton, Biryani masala, Curd, Ghee, Mint"),
      // 5 new
      food("ravadosa.avif", "Rava Dosa", 100, "Rava, Rice flour, Onion, Pepper, Cumin, Curry leaves"),
      food("podiidli.jpg", "Podi Idli", 80, "Idli, Gunpowder podi, Sesame oil, Ghee"),
      food("tomatorice.jpg", "Tomato Rice", 85, "Rice, Tomato, Onion, Spices, Curry leaves"),
      food("bisibelebath.avif", "Bisi Bele Bath", 110, "Rice, Toor dal, Vegetables, Bath masala, Ghee"),
      food("chickenchettinad.avif", "Chicken Chettinad", 260, "Chicken, Chettinad masala, Pepper, Coconut, Curry leaves")
    ]
  },

  desserts: {
    title: "Desserts",
    hero: "/images/desserts/hero.jpg",
    items: [
      food("chocolatecake.avif", "Chocolate Cake", 120, "Flour, Cocoa, Eggs, Butter, Chocolate ganache"),
      food("applepie.avif", "Apple Pie", 130, "Pastry crust, Apple, Cinnamon, Sugar, Butter"),
      food("newyorkcheesecake.avif", "New York Cheesecake", 170, "Cream cheese, Biscuit base, Sugar, Eggs, Vanilla"),
      food("chocolatechipcookies.avif", "Chocolate Chip Cookies", 80, "Flour, Butter, Brown sugar, Chocolate chips, Egg"),
      food("fudgybrownie.avif", "Fudgy Brownie", 110, "Dark chocolate, Butter, Sugar, Eggs, Walnuts"),
      food("tiramisu.avif", "Tiramisu", 180, "Ladyfingers, Mascarpone, Coffee, Cocoa, Eggs"),
      food("chocolatemousse.avif", "Chocolate Mousse", 140, "Dark chocolate, Cream, Eggs, Sugar"),
      food("cremebrulee.avif", "Creme Brulee", 190, "Cream, Egg yolks, Vanilla, Caramelised sugar"),
      food("churros.avif", "Churros", 120, "Flour, Cinnamon sugar, Chocolate sauce, Oil"),
      food("glazeddoughnut.avif", "Glazed Doughnut", 90, "Yeast dough, Sugar glaze, Milk, Butter"),
      food("gelato.jpg", "Gelato", 140, "Milk, Cream, Sugar, Natural flavours"),
      food("mangosorbet.avif", "Mango Sorbet", 120, "Ripe mango, Sugar syrup, Lemon juice"),
      food("gulabjamun.jpg", "Gulab Jamun", 70, "Khoya, Flour, Sugar syrup, Cardamom, Rose water"),
      food("rasgulla.jpg", "Rasgulla", 70, "Chenna, Sugar syrup, Cardamom"),
      food("kheer.jpg", "Kheer", 90, "Rice, Milk, Sugar, Saffron, Cashew, Raisins"),
      // 5 new
      food("rasmalai.jpg", "Rasmalai", 90, "Chenna, Milk, Sugar, Saffron, Pistachio, Cardamom"),
      food("jalebi.jpg", "Jalebi", 60, "Maida, Sugar syrup, Saffron, Ghee"),
      food("kajukatli.avif", "Kaju Katli", 100, "Cashew, Sugar, Ghee, Silver leaf"),
      food("mysorepak.jpg", "Mysore Pak", 80, "Gram flour, Ghee, Sugar, Cardamom"),
      food("sundae.avif", "Ice Cream Sundae", 150, "Vanilla ice cream, Chocolate sauce, Nuts, Cherry")
    ]
  },

  kerala: {
    title: "Kerala Food",
    hero: "/images/kerala/hero.jpg",
    items: [
      food("appam.avif", "Appam with Stew", 130, "Rice batter, Coconut milk, Vegetables, Potato, Whole spices"),
      food("puttu.jpg", "Puttu Kadala Curry", 100, "Rice flour, Coconut, Black chickpeas, Spices"),
      food("keralaparotta.jpg", "Kerala Parotta Beef Fry", 190, "Layered parotta, Beef, Onion, Coconut oil, Pepper"),
      food("fishcurry.jpg", "Kerala Fish Curry Meals", 180, "Rice, Fish curry, Kodampuli, Coconut, Thoran"),
      food("karimeen.jpg", "Karimeen Pollichathu", 320, "Pearl spot fish, Banana leaf, Spice paste, Coconut oil"),
      food("avial.jpg", "Avial", 90, "Mixed vegetables, Coconut, Curd, Curry leaves, Coconut oil"),
      food("unniyappam.jpg", "Unniyappam", 60, "Rice flour, Banana, Jaggery, Coconut bits, Ghee"),
      food("idiyappam.jpg", "Idiyappam Egg Curry", 120, "String hoppers, Egg, Onion, Tomato, Coconut milk"),
      food("chickenroast.jpg", "Kerala Chicken Roast", 220, "Chicken, Shallots, Coconut oil, Pepper, Curry leaves"),
      food("beefularthiyathu.jpg", "Beef Ularthiyathu", 230, "Beef, Coconut slices, Pepper, Curry leaves, Spices"),
      food("malabarbiryani.jpg", "Malabar Biryani", 250, "Kaima rice, Chicken, Fried onion, Ghee, Spices"),
      food("sadya.jpg", "Kerala Sadya", 200, "Rice, Sambar, Avial, Thoran, Payasam, Banana leaf"),
      food("pazhampori.jpg", "Pazhampori", 40, "Ripe banana, Maida, Sugar, Oil"),
      food("prawncurry.jpg", "Kerala Prawn Curry", 260, "Prawns, Coconut milk, Kodampuli, Chilli, Curry leaves"),
      food("kappameen.jpg", "Kappa and Meen Curry", 170, "Tapioca, Fish curry, Coconut, Shallots, Spices"),
      // 5 new
      food("eggroast.jpg", "Kerala Egg Roast", 120, "Boiled egg, Onion, Tomato, Coconut oil, Spices"),
      food("thalasserybiryani.avif", "Thalassery Biryani", 270, "Jeerakasala rice, Chicken, Fried onion, Ghee, Whole spices"),
      food("vegstew.jpg", "Vegetable Stew", 110, "Mixed vegetables, Coconut milk, Potato, Whole spices"),
      food("kallappam.jpg", "Kallappam", 70, "Rice batter, Toddy yeast, Coconut, Sugar"),
      food("adapradhaman.jpg", "Ada Pradhaman", 90, "Rice ada, Jaggery, Coconut milk, Cardamom, Ghee")
    ]
  },

  streetfood: {
    title: "Street Food",
    hero: "/images/streetfood/hero.jpg",
    items: [
      food("panipuri.avif", "Pani Puri", 50, "Puri, Spiced water, Potato, Chickpeas, Tamarind"),
      food("pavbhaji.avif", "Pav Bhaji", 100, "Pav, Mixed vegetable mash, Butter, Pav bhaji masala"),
      food("vadapav.avif", "Vada Pav", 40, "Pav, Potato vada, Garlic chutney, Green chilli"),
      food("bhelpuri.avif", "Bhel Puri", 60, "Puffed rice, Sev, Onion, Tomato, Tamarind chutney"),
      food("samosa.avif", "Samosa Chaat", 70, "Samosa, Chickpeas, Curd, Chutneys, Sev"),
      food("kathiroll.avif", "Kathi Roll", 110, "Paratha, Egg, Onion, Spiced filling, Chutney"),
      food("dahipuri.jpg", "Dahi Puri", 70, "Puri, Curd, Potato, Sev, Sweet chutney"),
      food("sevpuri.jpg", "Sev Puri", 60, "Flat puri, Potato, Onion, Sev, Green chutney"),
      food("alootikki.avif", "Aloo Tikki", 70, "Potato, Peas, Spices, Curd, Chutneys"),
      food("dabeli.jpg", "Dabeli", 50, "Pav, Spiced potato, Peanuts, Pomegranate, Sev"),
      food("misalpav.avif", "Misal Pav", 90, "Sprouted moth beans, Spicy curry, Farsan, Pav, Onion"),
      food("kachori.jpg", "Kachori", 40, "Flour, Moong dal filling, Spices, Oil"),
      food("cornchaat.avif", "Corn Chaat", 60, "Sweet corn, Butter, Lemon, Chaat masala, Onion"),
      food("eggroll.avif", "Egg Roll", 80, "Paratha, Egg, Onion, Green chilli, Sauce"),
      food("dahibhalla.avif", "Dahi Bhalla", 40, "Urad dal vada, Curd, Tamarind chutney, Spices"),
      // 5 new
      food("ragdapattice.jpg", "Ragda Pattice", 70, "Potato patty, White pea curry, Onion, Chutneys, Sev"),
      food("papdichaat.avif", "Papdi Chaat", 60, "Papdi, Potato, Chickpeas, Curd, Tamarind chutney"),
      food("cholebhature.jpg", "Chole Bhature", 110, "Bhature, Chickpea curry, Onion, Pickle"),
      food("breadpakoda.avif", "Bread Pakoda", 40, "Bread, Gram flour, Potato filling, Green chilli, Oil"),
      food("frankie.jpg", "Veg Frankie", 80, "Roti, Potato masala, Onion, Cabbage, Tangy sauce")
    ]
  },

  starters: {
    title: "Starters",
    hero: "/images/starters/hero.jpg",
    items: [
      food("chicken65.jpg", "Chicken 65", 140, "Chicken, Curry leaves, Red chilli, Ginger garlic, Curd"),
      food("gobi65.jpg", "Gobi 65", 110, "Cauliflower, Rice flour, Chilli powder, Curry leaves"),
      food("paneertikka.jpg", "Paneer Tikka", 170, "Paneer, Capsicum, Onion, Curd, Tikka masala"),
      food("paneer65.jpg", "Paneer 65", 160, "Paneer, Curd, Red chilli, Curry leaves, Corn flour"),
      food("babycorn.avif", "Baby Corn Fry", 130, "Baby corn, Batter, Pepper, Spices, Oil"),
      food("mushroompepper.avif", "Mushroom Pepper Fry", 150, "Mushroom, Black pepper, Onion, Curry leaves"),
      food("cheesecornballs.avif", "Cheese Corn Balls", 140, "Sweet corn, Cheese, Potato, Breadcrumbs"),
      food("hariyalikebab.jpg", "Hariyali Kebab", 160, "Spinach, Peas, Potato, Mint, Green chilli"),
      food("chickenpakoda.jpg", "Chicken Pakoda", 150, "Chicken, Gram flour, Ginger garlic, Spices"),
      food("onionpakoda.jpg", "Onion Pakoda", 70, "Onion, Gram flour, Green chilli, Curry leaves"),
      food("crispycorn.jpg", "Crispy Corn", 120, "Sweet corn, Corn flour, Pepper, Spring onion"),
      food("fishfingers.avif", "Fish Fingers", 190, "Fish fillet, Breadcrumbs, Egg, Pepper, Tartar sauce"),
      food("chickenfingers.avif", "Chicken Fingers", 180, "Chicken strips, Breadcrumbs, Egg, Spices"),
      food("vegcutlet.avif", "Veg Cutlet", 90, "Potato, Beetroot, Carrot, Breadcrumbs, Spices"),
      food("harabharakabab.avif", "Hara Bhara Kabab", 140, "Spinach, Peas, Potato, Paneer, Spices"),
      // 5 new
      food("mushroom65.jpg", "Mushroom 65", 140, "Mushroom, Rice flour, Red chilli, Curry leaves, Curd"),
      food("chilliidli.jpg", "Chilli Idli", 90, "Idli, Capsicum, Onion, Soy sauce, Chilli sauce"),
      food("chickenmajestic.jpg", "Chicken Majestic", 190, "Chicken, Curd, Curry leaves, Green chilli, Cashew"),
      food("fish65.jpg", "Fish 65", 200, "Fish, Red chilli, Curry leaves, Ginger garlic, Corn flour"),
      food("stuffedmushroom.jpg", "Cheese Stuffed Mushroom", 170, "Mushroom, Cheese, Breadcrumbs, Garlic, Herbs")
    ]
  },

  italian: {
    title: "Italian",
    hero: "/images/italian/hero.jpg",
    items: [
      food("pasta.avif", "Creamy Pasta", 220, "Penne, Cream, Cheese, Garlic, Herbs"),
      food("margherita.avif", "Margherita Pizza", 250, "Pizza dough, Tomato sauce, Mozzarella, Fresh basil"),
      food("garlicbread.avif", "Garlic Bread", 120, "Baguette, Garlic butter, Parsley, Cheese"),
      food("alfredo.avif", "Alfredo Pasta", 240, "Fettuccine, Butter, Cream, Parmesan, Garlic"),
      food("arrabbiata.avif", "Arrabbiata Pasta", 230, "Penne, Tomato, Garlic, Red chilli, Olive oil"),
      food("lasagna.avif", "Veg Lasagna", 280, "Lasagna sheets, Vegetables, White sauce, Cheese"),
      food("penne.avif", "Penne Pesto", 240, "Penne, Basil pesto, Pine nuts, Parmesan, Olive oil"),
      food("spaghetti.avif", "Spaghetti Bolognese", 260, "Spaghetti, Minced meat, Tomato sauce, Herbs"),
      food("risotto.avif", "Mushroom Risotto", 270, "Arborio rice, Mushroom, Parmesan, Butter, Stock"),
      food("bruschetta.avif", "Bruschetta", 150, "Toasted bread, Tomato, Basil, Garlic, Olive oil"),
      food("pepperonipizza.avif", "Pepperoni Pizza", 320, "Pizza dough, Pepperoni, Mozzarella, Tomato sauce"),
      food("farmhousepizza.jpg", "Farmhouse Pizza", 300, "Pizza dough, Mushroom, Capsicum, Onion, Tomato, Cheese"),
      food("mushroompizza.jpg", "Mushroom Pizza", 280, "Pizza dough, Mushroom, Mozzarella, Garlic, Herbs"),
      food("minestrone.avif", "Minestrone Soup", 140, "Mixed vegetables, Beans, Pasta, Tomato, Herbs"),
      food("tiramisu.avif", "Tiramisu", 180, "Ladyfingers, Mascarpone, Coffee, Cocoa, Eggs"),
      // 5 new
      food("fourcheesepizza", "Four Cheese Pizza", 340, "Pizza dough, Mozzarella, Cheddar, Parmesan, Gorgonzola"),
      food("macandcheese", "Mac and Cheese", 220, "Macaroni, Cheddar, Milk, Butter, Pepper"),
      food("capresesalad", "Caprese Salad", 190, "Tomato, Mozzarella, Fresh basil, Olive oil, Balsamic"),
      food("chickenparmesan", "Chicken Parmesan", 330, "Chicken, Breadcrumbs, Tomato sauce, Mozzarella, Parmesan"),
      food("pannacotta", "Panna Cotta", 170, "Cream, Sugar, Vanilla, Gelatin, Berry sauce")
    ]
  },

  seafood: {
    title: "Seafood",
    hero: "/images/seafood/hero.jpg",
    items: [
      food("fishfry.jpg", "Fish Fry", 200, "Fish, Chilli powder, Turmeric, Lemon, Oil"),
      food("prawn.jpg", "Prawn Masala", 260, "Prawns, Onion, Tomato, Garlic, Masala"),
      food("calamari.avif", "Calamari", 240, "Squid rings, Flour, Breadcrumbs, Lemon, Garlic mayo"),
      food("grilledfish.avif", "Grilled Fish", 280, "Fish fillet, Lemon, Garlic, Herbs, Olive oil"),
      food("prawnfry.jpg", "Prawn Fry", 250, "Prawns, Chilli, Pepper, Curry leaves, Oil"),
      food("crabmasala.jpg", "Crab Masala", 320, "Crab, Onion, Tomato, Coconut, Spices"),
      food("fishtikka.jpg", "Fish Tikka", 240, "Fish, Curd, Tikka masala, Lemon, Ajwain"),
      food("garlicprawns.jpg", "Butter Garlic Prawns", 290, "Prawns, Butter, Garlic, Parsley, Lemon"),
      food("fishandchips.jpg", "Fish and Chips", 260, "Battered fish, Potato chips, Tartar sauce, Lemon"),
      food("apollofish.jpg", "Apollo Fish", 230, "Fish, Curry leaves, Green chilli, Curd, Spices"),
      food("tawafish.jpg", "Tawa Fish", 220, "Fish, Rava coating, Chilli, Lemon, Butter"),
      food("squidfry.jpg", "Squid Fry", 230, "Squid, Onion, Pepper, Curry leaves, Spices"),
      food("chillifish.jpg", "Chilli Fish", 210, "Fish, Capsicum, Onion, Soy sauce, Chilli sauce"),
      food("prawnbiryani.jpg", "Prawn Biryani", 300, "Basmati rice, Prawns, Biryani masala, Mint, Ghee"),
      food("seafoodsoup.jpg", "Seafood Soup", 180, "Prawns, Fish, Vegetables, Pepper, Stock"),
      // 5 new
      food("fishcurry2.avif", "Fish Curry", 230, "Fish, Tamarind, Coconut, Shallots, Curry leaves"),
      food("prawnthokku.jpg", "Prawn Thokku", 270, "Prawns, Onion, Tomato, Red chilli, Gingelly oil"),
      food("fishcutlet.avif", "Fish Cutlet", 150, "Fish, Potato, Onion, Breadcrumbs, Pepper"),
      food("saltpeppersquid.jpg", "Salt and Pepper Squid", 250, "Squid, Corn flour, Salt, Black pepper, Chilli, Garlic"),
      food("fishmoilee.jpg", "Fish Moilee", 260, "Fish, Coconut milk, Green chilli, Ginger, Curry leaves")
    ]
  },

  tandoori: {
    title: "Tandoori",
    hero: "/images/tandoori/hero.jpg",
    items: [
      food("tandoorichicken.jpg", "Tandoori Chicken", 280, "Chicken, Curd, Kashmiri chilli, Ginger garlic, Lemon"),
      food("seekhkebab.jpg", "Seekh Kebab", 220, "Minced chicken, Onion, Mint, Spices, Skewer"),
      food("butternaan.jpg", "Butter Naan", 40, "Maida, Curd, Butter, Yeast"),
      food("chickentikka.jpg", "Chicken Tikka", 240, "Chicken, Curd, Tikka masala, Lemon, Capsicum"),
      food("malaitikka.jpg", "Malai Tikka", 250, "Chicken, Cream, Cheese, Cardamom, White pepper"),
      food("tandooripaneer.jpg", "Tandoori Paneer", 220, "Paneer, Curd, Capsicum, Onion, Tandoori masala"),
      food("reshmikebab.jpg", "Reshmi Kebab", 250, "Chicken, Cream, Cashew paste, Spices, Butter"),
      food("afghanichicken.jpg", "Afghani Chicken", 270, "Chicken, Cream, Cashew, Cardamom, White pepper"),
      food("tangdikebab.jpg", "Tangdi Kebab", 260, "Chicken drumsticks, Curd, Spices, Lemon, Butter"),
      food("tandooriroti.jpg", "Tandoori Roti", 25, "Whole wheat flour, Water, Salt"),
      food("kulcha.jpg", "Amritsari Kulcha", 70, "Maida, Potato filling, Butter, Spices"),
      food("lachaparatha.jpg", "Lacha Paratha", 50, "Wheat flour, Ghee, Salt"),
      food("tandooriprawns.jpg", "Tandoori Prawns", 320, "Prawns, Curd, Chilli, Ajwain, Lemon"),
      food("muttonseekh.jpg", "Mutton Seekh", 290, "Minced mutton, Onion, Green chilli, Spices, Coriander"),
      food("tandoorialoo.jpg", "Tandoori Aloo", 150, "Baby potato, Curd, Spices, Lemon, Chaat masala"),
      // 5 new
      food("tandoorimushroom.avif", "Tandoori Mushroom", 190, "Mushroom, Curd, Tandoori masala, Capsicum, Lemon"),
      food("soyachaap.jpg", "Soya Chaap Tikka", 180, "Soya chaap, Curd, Tikka masala, Onion, Lemon"),
      food("garlicnaan.avif", "Garlic Naan", 55, "Maida, Curd, Garlic, Butter, Coriander"),
      food("muttonboti.jpg", "Mutton Boti Kebab", 310, "Mutton, Raw papaya, Curd, Spices, Ghee"),
      food("tandoorifish.avif", "Tandoori Fish", 270, "Fish, Curd, Ajwain, Kashmiri chilli, Lemon")
    ]
  },

  healthy: {
    title: "Healthy",
    hero: "/images/healthy/hero.jpg",
    items: [
      food("greensalad.jpg", "Green Salad", 90, "Lettuce, Cucumber, Tomato, Carrot, Lemon dressing"),
      food("fruitbowl.avif", "Fruit Bowl", 110, "Apple, Banana, Papaya, Pomegranate, Grapes"),
      food("sprouts.avif", "Sprouts Chaat", 80, "Mixed sprouts, Onion, Tomato, Lemon, Chaat masala"),
      food("oats.avif", "Oats Porridge", 90, "Oats, Milk, Honey, Nuts, Fruits"),
      food("quinoa.avif", "Quinoa Bowl", 180, "Quinoa, Vegetables, Chickpeas, Olive oil, Lemon"),
      food("greeksalad.avif", "Greek Salad", 160, "Cucumber, Tomato, Olives, Feta, Olive oil"),
      food("vegsoup.jpg", "Clear Veg Soup", 90, "Mixed vegetables, Pepper, Garlic, Stock"),
      food("grilledveg.avif", "Grilled Vegetables", 150, "Zucchini, Capsicum, Mushroom, Olive oil, Herbs"),
      food("smoothiebowl.avif", "Smoothie Bowl", 170, "Banana, Berries, Yogurt, Granola, Seeds"),
      food("boiledegg.avif", "Boiled Egg Plate", 70, "Boiled eggs, Pepper, Salt, Salad"),
      food("chickpeasalad.avif", "Chickpea Salad", 120, "Chickpeas, Cucumber, Tomato, Onion, Lemon"),
      food("paneersalad.avif", "Paneer Salad", 150, "Paneer, Lettuce, Cucumber, Tomato, Olive oil"),
      food("avocadotoast.avif", "Avocado Toast", 160, "Multigrain bread, Avocado, Lemon, Chilli flakes, Seeds"),
      food("proteinshake.avif", "Protein Shake", 150, "Milk, Banana, Peanut butter, Protein powder, Oats"),
      food("milletupma.jpg", "Millet Upma", 90, "Millet, Vegetables, Mustard, Curry leaves, Ginger"),
      // 5 new
      food("moongchilla.jpg", "Moong Dal Chilla", 100, "Moong dal, Onion, Green chilli, Coriander, Ginger"),
      food("ragidosa.jpg", "Ragi Dosa", 90, "Ragi flour, Rice flour, Onion, Curry leaves, Cumin"),
      food("yogurtparfait.avif", "Fruit Yogurt Parfait", 130, "Greek yogurt, Granola, Berries, Honey"),
      food("steamedmomos.avif", "Steamed Veg Momos", 110, "Whole wheat wrapper, Cabbage, Carrot, Ginger, Garlic"),
      food("grilledchickensalad.avif", "Grilled Chicken Salad", 210, "Grilled chicken, Lettuce, Cucumber, Tomato, Olive oil")
    ]
  }
};

// Words that make a dish Non-veg (Indian rule: egg counts as non-veg)
const nonVeg =
  /\b(chicken|mutton|beef|fish|prawns?|crab|squid|calamari|eggs?|sausage|pepperoni|minced|meen|seafood)\b/i;

// Words in the dish name that show a "Spicy" tag
const spicy = /chilli|65|schezwan|dragon|manchurian|arrabbiata|lollipop|chettinad|peri/i;

// Cafe is split in 4 groups of 5
const cafeGroups = ["Coffee", "Tea", "Puffs", "Shakes & Coolers"];

export const menuData = Object.fromEntries(
  Object.entries(raw).map(([slug, category]) => [
    slug,
    {
      ...category,
      slug,
      items: category.items.map((item, i) => {
        const image = `/images/${slug}/${item.image}`;
        return {
          ...item,
          id: image,
          image,
          category: slug,
          showVeg: slug !== "cafe", // Cafe shows no veg/non-veg dot
          priceNum: Number(item.price.replace(/\D/g, "")),
          veg: !nonVeg.test(item.name + " " + item.ingredients.join(" ")),
          tag:
            i === 0 ? "Bestseller"
            : spicy.test(item.name) ? "Spicy"
            : i === 3 ? "Chef's Special"
            : "",
          group: slug === "cafe" ? cafeGroups[Math.floor(i / 5)] : null
        };
      })
    }
  ])
);

// Same order as the Menu cards on Home (used by Previous / Next)
export const categoryOrder = [
  "fastfood", "chinese", "cafe", "traditional", "desserts", "starters",
  "italian", "seafood", "tandoori", "healthy", "kerala", "streetfood"
];