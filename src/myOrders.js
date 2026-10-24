const KEY = "dinenow_my_orders";

export function getMyOrders() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

// Newest first, keeps the last 200 orders
export function rememberOrder(order) {
  if (!order || !order.id) return; // never save an order without its id
  try {
    const list = [order, ...getMyOrders().filter((o) => o.id !== order.id)].slice(0, 200);
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // storage full or blocked: ignore
  }
}

export function forgetOrder(id) {
  try {
    localStorage.setItem(KEY, JSON.stringify(getMyOrders().filter((o) => o.id !== id)));
  } catch {
    // ignore
  }
}