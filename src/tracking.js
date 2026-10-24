export function placedTime(order) {
  if (order.createdAt && order.createdAt.toMillis) return order.createdAt.toMillis();
  return order.placedAt || null;
}

// Timer status. It NEVER returns Delivered: only the admin can do that.
export function autoStatus(order, now = Date.now()) {
  if (order.status && order.status !== "New") return order.status;

  const placed = placedTime(order);
  if (!placed || !order.etaMinutes) return "New";

  const min = (now - placed) / 60000;

  if (min >= order.etaMinutes * 0.5) {
    return order.type === "Delivery" ? "Out for delivery" : "Ready";
  }
  if (min >= 1) return "Preparing";
  return "New";
}