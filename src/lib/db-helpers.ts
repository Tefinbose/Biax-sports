export function formatProduct(p: any) {
  if (!p) return null;
  return {
    ...p,
    _id: p.id,
    id: p.id,
    images: Array.isArray(p.images) ? p.images : [],
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    colors: Array.isArray(p.colors) ? p.colors : [],
  };
}

export function formatOrder(o: any) {
  if (!o) return null;
  return {
    _id: o.id,
    id: o.id,
    orderNumber: o.orderNumber,
    customer: {
      name: o.customerName,
      email: o.customerEmail,
      phone: o.customerPhone,
    },
    shippingAddress: {
      addressLine1: o.addressLine1,
      addressLine2: o.addressLine2 || "",
      city: o.city,
      state: o.state,
      postalCode: o.postalCode,
      country: o.country || "India",
    },
    items: (o.items || []).map((it: any) => ({
      productId: it.productId,
      name: it.name,
      slug: it.slug,
      image: it.image || "",
      price: it.price,
      quantity: it.quantity,
      lineTotal: it.lineTotal,
    })),
    subtotal: o.subtotal,
    shippingCharge: o.shippingCharge,
    couponCode: o.couponCode || "",
    discountAmount: o.discountAmount,
    total: o.total,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
    customerNotes: o.customerNotes || "",
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

