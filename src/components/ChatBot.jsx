import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Send, Bot, Plus, Trash2, Sparkles, Leaf, Flame, Wallet, Utensils, MapPin } from "lucide-react";
import { menuData } from "../data/menuData";
import { useCart } from "../context/CartContext";
import FoodImage from "./FoodImage";
import VegDot from "./VegDot";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */
const categories = Object.values(menuData);

const SPICY_WORDS =
  /chilli|chili|pepper|65|schezwan|dragon|manchurian|arrabbiata|lollipop|chettinad|peri|masala|tikka|kebab|kabab|tandoori|biryani|curry|salna|ularthiyathu|roast|apollo|pakoda|misal|kathi|spicy|mirchi|pav bhaji|chaat/i;

const allDishes = categories.flatMap((c) =>
  c.items.map((i) => ({
    ...i,
    categoryTitle: c.title,
    slug: c.slug,
    spicy: SPICY_WORDS.test(i.name + " " + i.ingredients.join(" "))
  }))
);

const cities = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
  "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Tiruppur"
];

const quickReplies = [
  { label: "Recommend something", icon: <Sparkles size={13} /> },
  { label: "Veg dishes", icon: <Leaf size={13} /> },
  { label: "Under 100", icon: <Wallet size={13} /> },
  { label: "Spicy food", icon: <Flame size={13} /> },
  { label: "Combo under 500", icon: <Utensils size={13} /> },
  { label: "Branches", icon: <MapPin size={13} /> }
];

/* ------------------------------------------------------------------ */
/*  REPLY WORDING (changes every time)                                 */
/* ------------------------------------------------------------------ */
const randomOf = (list) => list[Math.floor(Math.random() * list.length)];

function intro(n, label) {
  const what = label ? `${label} dishes` : "dishes";
  return randomOf([
    `Here you go! ${n} ${what} for you.`,
    `Sure thing, I found ${n} ${what}.`,
    `Great choice! Take a look at these ${n} ${what}.`,
    `Coming right up: ${n} ${what}.`,
    `Hungry? Here are ${n} ${what} to pick from.`
  ]);
}

/* ------------------------------------------------------------------ */
/*  TEXT HELPERS                                                       */
/* ------------------------------------------------------------------ */
const STOP = new Set([
  "i", "me", "my", "we", "you", "the", "a", "an", "and", "or", "of", "to", "for",
  "in", "on", "with", "is", "are", "do", "does", "have", "has", "can", "want",
  "need", "please", "show", "give", "tell", "get", "some", "any", "what", "which",
  "about", "like", "good", "best", "dish", "dishes", "food", "item", "items",
  "add", "order", "cart", "it", "that", "this", "one", "now", "u", "pls", "plz"
]);

// Generic words that must never count as a category name
const GENERIC = new Set(["food", "foods", "dish", "dishes", "item", "items", "menu"]);

const tokens = (s) =>
  s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);

function lev(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

function near(a, b) {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4) return false;
  return lev(a, b) <= (Math.max(a.length, b.length) > 6 ? 2 : 1);
}

const hasAny = (words, list) => words.some((w) => list.some((k) => near(w, k)));

function searchDishes(words) {
  const q = words.filter((w) => !STOP.has(w) && w.length > 1);
  if (q.length === 0) return [];

  return allDishes
    .map((d) => {
      const nameWords = tokens(d.name);
      const ingWords = tokens(d.ingredients.join(" "));
      let score = 0;
      q.forEach((w) => {
        if (nameWords.some((n) => n === w || n.startsWith(w))) score += 4;
        else if (nameWords.some((n) => near(n, w))) score += 3;
        else if (ingWords.some((n) => n === w)) score += 1.5;
        else if (ingWords.some((n) => near(n, w))) score += 1;
      });
      return { d, score };
    })
    .filter((x) => x.score >= 2)
    .sort((a, b) => b.score - a.score || a.d.priceNum - b.d.priceNum)
    .map((x) => x.d);
}

function findCategory(words) {
  const w = words.filter((x) => !STOP.has(x) && !GENERIC.has(x));
  if (w.length === 0) return null;

  return categories.find((c) => {
    const names = [...tokens(c.title).filter((n) => !GENERIC.has(n)), c.slug];
    return w.some((x) => names.some((n) => n.length > 3 && near(x, n)));
  });
}

function buildCombo(budget, vegOnly) {
  const groups = [
    { slugs: ["starters"], share: 0.25 },
    { slugs: ["traditional", "chinese", "fastfood", "italian", "tandoori", "kerala"], share: 0.5 },
    { slugs: ["cafe", "desserts"], share: 0.25 }
  ];

  const picked = [];
  groups.forEach((g) => {
    const pool = allDishes
      .filter((d) => g.slugs.includes(d.slug))
      .filter((d) => (vegOnly ? d.veg : true))
      .filter((d) => d.priceNum <= budget * g.share)
      .sort((a, b) => b.priceNum - a.priceNum);
    if (pool.length) picked.push(pool[0]);
  });
  return picked;
}

/* ------------------------------------------------------------------ */
/*  THE BRAIN: text in, reply out                                      */
/* ------------------------------------------------------------------ */
function getReply(input, ctx) {
  const { total, count, addItem, clearCart, memory } = ctx;
  const t = input.toLowerCase().trim();
  const words = tokens(t);

  const showList = (text, list, extra = {}) => {
    memory.list = list;
    memory.shown = list.length;
    return { text, dishes: list, ...extra };
  };

  /* ---------- ACTIONS ---------- */
  if (/\b(clear|empty)\b.*\bcart\b|\bremove all\b/.test(t)) {
    clearCart();
    return { text: "Done, your cart is now empty." };
  }

  if (/^(add|order|buy|get me|i want|i will take)\b/.test(t) || /\badd\b.*\bto cart\b/.test(t)) {
    const qtyMatch = t.match(/\b(\d{1,2})\b/);
    const qty = qtyMatch ? Math.max(1, Math.min(Number(qtyMatch[1]), 20)) : 1;

    let dish = null;
    if (/\b(first|1st)\b/.test(t) && memory.list[0]) dish = memory.list[0];
    else if (/\b(second|2nd)\b/.test(t) && memory.list[1]) dish = memory.list[1];
    else if (/\b(third|3rd)\b/.test(t) && memory.list[2]) dish = memory.list[2];
    else if (/\b(it|that|this|them)\b/.test(t) && memory.last) dish = memory.last;
    else dish = searchDishes(words)[0] || null;

    if (!dish) return { text: "Which dish should I add? Try: add 2 chicken biryani." };

    addItem(dish, qty);
    memory.last = dish;
    return {
      text: `Added ${qty} x ${dish.name} (Rs.${dish.priceNum * qty}) to your cart. Open the cart to place the order.`
    };
    <div style={{ fontSize: "15px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
  {d.name}
  {d.spicy && <Flame size={14} color="#e74c3c" />}
</div>
  }

  /* ---------- SMALL TALK AND INFO ---------- */
  if (hasAny(words, ["hi", "hello", "hey", "hai", "vanakkam"]) && words.length <= 3)
    return { text: "Hi! I'm the DineNow assistant. Ask me for recommendations, prices, veg dishes, combos, branches or timings." };

  if (hasAny(words, ["thanks", "thank", "thx", "nandri"]))
    return { text: "You're welcome! Anything else I can help with?" };

  if (hasAny(words, ["bye", "goodbye"]))
    return { text: "Bye! Enjoy your meal." };

  if (/\b(hours?|timings?|open|close|closing|24)\b/.test(t))
    return { text: "We are open 24 hours, 7 days a week, at every branch." };

  if (hasAny(words, ["branch", "branches", "location", "address", "city", "cities", "where"]))
    return { text: "Our branches in Tamil Nadu: " + cities.join(", ") + "." };

  if (hasAny(words, ["book", "reserve", "reservation"]) || /\btable\b/.test(t))
    return { text: "To reserve a table, click the gold Book a Table button in the menu bar on the Home page. Pick your date, time, guests and table." };

  if (hasAny(words, ["phone", "call", "contact", "email"]))
    return { text: "Call us on +91 98765 43210 or email hello@dinenow.com." };

  if (/\b(cart|bill|total)\b/.test(t))
    return {
      text: count > 0
        ? `You have ${count} item${count > 1 ? "s" : ""} in your cart, total Rs.${total}.`
        : "Your cart is empty. Tell me what you feel like eating!"
    };

  if (/\b(categories|category|menu)\b/.test(t) && !findCategory(words))
    return { text: "We have: " + categories.map((c) => c.title).join(", ") + ". Ask for any of them, for example Chinese." };

  if (/\b(help|what can you do)\b/.test(t))
    return { text: "I can recommend dishes, filter by veg, spicy or price, build a combo for your budget, add items to your cart, and tell you about branches and timings. Try: veg under 150, or add 2 burger." };

  /* ---------- COMBO ---------- */
  const budgetMatch = t.match(/(?:rs\.?|₹)?\s*(\d{3,5})/);
  if (/\b(combo|meal|party|feast)\b/.test(t) && budgetMatch) {
    const budget = Number(budgetMatch[1]);
    const vegOnly = !/non[\s-]?veg/.test(t) && /\bveg(etarian)?\b/.test(t);
    const combo = buildCombo(budget, vegOnly);
    if (combo.length === 0) return { text: "That budget is too low for a combo. Try a higher amount." };
    const sum = combo.reduce((s, d) => s + d.priceNum, 0);
    return showList(
      randomOf([
        `Here's a tasty combo within Rs.${budget} (total Rs.${sum}):`,
        `Budget Rs.${budget}? This combo costs Rs.${sum}:`,
        `A full meal for Rs.${sum}, inside your Rs.${budget} budget:`
      ]),
      combo
    );
  }

  /* ---------- FILTERS: veg, non-veg, spicy, price ---------- */
  const priceMatch = t.match(
    /(?:under|below|less than|within|upto|up to|max|budget)\s*(?:rs\.?|₹)?\s*(\d+)/
  );
  const wantsNonVeg = /non[\s-]?veg/.test(t);
  const wantsVeg = !wantsNonVeg && hasAny(words, ["veg", "vegetarian"]);
  const wantsSpicy = hasAny(words, ["spicy", "spice", "fiery", "kaaram", "hot"]);
  const wantsCheap = hasAny(words, ["cheap", "cheapest", "affordable"]);
  const wantsPremium = hasAny(words, ["expensive", "premium", "costly"]);

  if (priceMatch || wantsVeg || wantsNonVeg || wantsSpicy || wantsCheap || wantsPremium) {
    const cat = findCategory(words);
    let list = cat ? allDishes.filter((d) => d.slug === cat.slug) : allDishes;

    const labels = [];
    if (wantsVeg) { list = list.filter((d) => d.veg); labels.push("veg"); }
    if (wantsNonVeg) { list = list.filter((d) => !d.veg); labels.push("non-veg"); }
    if (wantsSpicy) { list = list.filter((d) => d.spicy); labels.push("spicy"); }
    if (priceMatch) {
      list = list.filter((d) => d.priceNum <= Number(priceMatch[1]));
      labels.push(`under Rs.${priceMatch[1]}`);
    }
    if (wantsCheap) { list = [...list].sort((a, b) => a.priceNum - b.priceNum); labels.push("budget"); }
    if (wantsPremium) { list = [...list].sort((a, b) => b.priceNum - a.priceNum); labels.push("premium"); }

    if (list.length === 0)
      return { text: "Hmm, nothing matches that. Try a higher price or a different filter." };

    return showList(intro(list.length, labels.join(", ")), list);
  }

  /* ---------- RECOMMEND ---------- */
  if (hasAny(words, ["recommend", "suggest", "popular", "bestseller", "bestsellers", "famous", "special", "surprise"])) {
    const best = allDishes.filter((d) => d.tag === "Bestseller");
    return showList(
      randomOf([
        `Our customers love these ${best.length} dishes:`,
        `Chef's favourites, ${best.length} bestsellers for you:`,
        `Can't go wrong with these ${best.length} popular picks:`
      ]),
      best
    );
  }

  if (/\b(hungry|starving|dinner|lunch|breakfast|snack)\b/.test(t)) {
    const slugs = /breakfast/.test(t)
      ? ["traditional", "cafe"]
      : /snack/.test(t)
      ? ["streetfood", "starters", "cafe"]
      : ["traditional", "chinese", "fastfood", "tandoori"];
    const list = allDishes.filter((d) => slugs.includes(d.slug) && d.tag);
    return showList(intro(list.length, "good"), list);
  }

  /* ---------- CATEGORY AND DISH SEARCH ---------- */
  const cat = findCategory(words);
  if (cat) {
    const list = allDishes.filter((d) => d.slug === cat.slug);
    return showList(
      randomOf([
        `Welcome to ${cat.title}! All ${list.length} dishes:`,
        `Here's everything in ${cat.title} (${list.length} dishes):`,
        `${cat.title} it is! Take your pick:`
      ]),
      list,
      { openSlug: cat.slug }
    );
  }

  const matches = searchDishes(words);
  if (matches.length > 0) {
    memory.last = matches[0];
    return showList(
      randomOf([
        `I found ${matches.length} match${matches.length > 1 ? "es" : ""} for you:`,
        `These look like what you want:`,
        `Here's what I found:`
      ]),
      matches
    );
  }

  return {
    text: "Sorry, I didn't get that. Try: Recommend something, Veg dishes, Spicy food, Under 100, Combo under 500, a dish name like biryani, or add 2 burger."
  };
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
function ChatBot() {
  const navigate = useNavigate();
  const { addItem, clearCart, total, count } = useCart();

  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm the DineNow assistant. What are you in the mood for?" }
  ]);

  const bottom = useRef(null);
  const memory = useRef({ list: [], shown: 0, last: null });

  // Greeting bubble appears after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setHint(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (bottom.current) bottom.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  function openDish(d) {
    navigate(`/menu/${d.slug}`, { state: { openFood: d.id } });
  }

  function send(value) {
    const msg = (value ?? text).trim();
    if (!msg || typing) return;

    setMessages((m) => [...m, { from: "user", text: msg }]);
    setText("");
    setTyping(true);

    setTimeout(() => {
      const reply = getReply(msg, {
        total,
        count,
        addItem,
        clearCart,
        memory: memory.current
      });
      setMessages((m) => [...m, { from: "bot", ...reply }]);
      setTyping(false);
    }, 500);
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <div
          style={{
            position: "fixed",
            right: "24px",
            bottom: "24px",
            zIndex: 150,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "10px"
          }}
        >
          {/* Greeting bubble */}
          {hint && (
            <div
              className="pop-in"
              onClick={() => { setOpen(true); setHint(false); }}
              style={{
                position: "relative",
                maxWidth: "210px",
                padding: "10px 14px",
                borderRadius: "14px 14px 4px 14px",
                backgroundColor: "#222",
                border: "1px solid rgba(212,165,116,0.5)",
                color: "#eee",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(0,0,0,0.5)"
              }}
            >
              Hungry? Ask me for dish ideas!
              <X
                size={14}
                color="#888"
                onClick={(e) => { e.stopPropagation(); setHint(false); }}
                style={{
                  position: "absolute",
                  top: "-8px",
                  left: "-8px",
                  background: "#111",
                  borderRadius: "50%",
                  padding: "2px",
                  cursor: "pointer"
                }}
              />
            </div>
          )}

          {/* Pill button */}
          <button
            className="chat-fab"
            onClick={() => { setOpen(true); setHint(false); }}
            title="Chat with us"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              height: "56px",
              padding: "0 22px 0 16px",
              borderRadius: "30px",
              border: "none",
              background: "linear-gradient(135deg, #e6b987, #d4a574)",
              color: "#111",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            <Bot size={26} />
            Ask DineNow
            <span
              style={{
                position: "absolute",
                top: "4px",
                right: "6px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#2ecc71",
                border: "2px solid #111"
              }}
            />
          </button>
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div
          className="pop-in"
          style={{
            position: "fixed",
            right: "24px",
            bottom: "24px",
            zIndex: 150,
            width: "380px",
            maxWidth: "calc(100vw - 32px)",
            height: "600px",
            maxHeight: "calc(100vh - 48px)",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(212,165,116,0.5)",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)"
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              backgroundColor: "#111",
              borderBottom: "1px solid rgba(212,165,116,0.25)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#d4a574" }}>
              <Bot size={24} />
              <div>
                <b>DineNow Assistant</b>
                <div style={{ fontSize: "12px", color: "#2ecc71" }}>Online</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <Trash2
                size={18}
                color="#888"
                title="Clear chat"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  memory.current = { list: [], shown: 0, last: null };
                  setMessages([{ from: "bot", text: "Chat cleared. What are you in the mood for?" }]);
                }}
              />
              <X size={22} color="#d4a574" style={{ cursor: "pointer" }} onClick={() => setOpen(false)} />
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    backgroundColor: m.from === "user" ? "#d4a574" : "#2a2a2a",
                    color: m.from === "user" ? "#111" : "#eee",
                    fontSize: "14px",
                    lineHeight: "1.5"
                  }}
                >
                  {m.text}
                </div>

                {m.dishes && (
                  <div style={{ width: "100%", marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {m.dishes.map((d) => (
                      <div
                        key={d.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px",
                          borderRadius: "12px",
                          backgroundColor: "#222",
                          border: "1px solid #333"
                        }}
                      >
                        <div
                          onClick={() => openDish(d)}
                          style={{
                            position: "relative",
                            width: "80px",
                            height: "80px",
                            flexShrink: 0,
                            borderRadius: "10px",
                            overflow: "hidden",
                            cursor: "pointer"
                          }}
                        >
                          <FoodImage
                            src={d.image}
                            alt={d.name}
                            style={{ width: "100%", height: "100%" }}
                          />
                          <span style={{ position: "absolute", top: "5px", right: "5px" }}>
                            <VegDot veg={d.veg} />
                          </span>
                        </div>

                        <div
                          style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                          onClick={() => openDish(d)}
                        >
                          <div style={{ fontSize: "15px", fontWeight: "bold" }}>{d.name}</div>
                          <small style={{ color: "#aaa" }}>{d.categoryTitle}</small>
                          <div style={{ color: "#d4a574", fontWeight: "bold", marginTop: "2px" }}>
                            {d.price}
                          </div>
                        </div>

                        <button
                          onClick={() => addItem(d)}
                          title="Add to cart"
                          style={{
                            width: "34px",
                            height: "34px",
                            flexShrink: 0,
                            borderRadius: "50%",
                            border: "none",
                            backgroundColor: "#d4a574",
                            color: "#111",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    ))}

                    <small style={{ color: "#888", textAlign: "center" }}>
                      Tap a photo or name to open the dish. Tap + to add to cart.
                    </small>

                    {m.openSlug && (
                      <button
                        onClick={() => navigate(`/menu/${m.openSlug}`)}
                        style={{
                          padding: "8px",
                          borderRadius: "8px",
                          border: "1px solid #d4a574",
                          background: "transparent",
                          color: "#d4a574",
                          cursor: "pointer"
                        }}
                      >
                        See full menu
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {typing && <div style={{ color: "#aaa", fontSize: "14px" }}>Assistant is typing...</div>}
            <div ref={bottom} />
          </div>

          {/* Quick replies */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", padding: "0 14px 10px" }}>
           {quickReplies.map((q) => (
  <button
    key={q.label}
    className="pill"
    onClick={() => send(q.label)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "5px",
      padding: "5px 12px",
      borderRadius: "20px",
      border: "1px solid rgba(212,165,116,0.5)",
      background: "transparent",
      color: "#d4a574",
      fontSize: "12px",
      cursor: "pointer"
    }}
  >
    {q.icon} {q.label}
  </button>
))}
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: "8px", padding: "12px 14px", borderTop: "1px solid #2a2a2a" }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about food, price, branches..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "30px",
                border: "1px solid #555",
                backgroundColor: "#222",
                color: "white",
                fontSize: "14px"
              }}
            />
            <button
              onClick={() => send()}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#d4a574",
                color: "#111",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;