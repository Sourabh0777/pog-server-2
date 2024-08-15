import prisma from '../config/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendDataToDb = async (response: any) => {
  try {
    for (const orderData of response) {
      const { Order, OrderItem } = orderData;

      // Start a transaction
      await prisma.$transaction(async prisma => {
        // Create Order
        const createdOrder = await prisma.order.create({
          data: {
            restaurantID: parseInt(Order.restaurant_id),
            invoiceID: parseInt(Order.invoice_id),
            paymentTypeID: parseInt(Order.payment_type),
            orderTypeID: parseInt(Order.order_type),
            paymentStatus: Order.payment_confirmation,
            cancelReason: Order.cancel_order_description || null,
            orderAmount: parseFloat(Order.core_price),
            discount: parseFloat(Order.discount),
            netAmountAfterDiscount: parseFloat(Order.total),
            containerCharges: parseFloat(Order.packing_charge),
            deliveryCharges: parseFloat(Order.delivery_charge),
            serviceCharges: parseFloat(Order.service_charge),
            totalTax: parseFloat(Order.tax),
            totalAmount: parseFloat(Order.total),
            nonTaxableAmount: parseFloat(Order.old_total),
            CGST: parseFloat(Order.tax),
            SGST: parseFloat(Order.tax),
            VAT: parseFloat(Order.tax),
            items: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              create: OrderItem.map((item: any) => ({
                itemID: parseInt(item.item_id),
                quantity: parseInt(item.quantity),
                priceAmount: parseFloat(item.price),
                discountAmount: parseFloat(item.total_discount),
                CGST: parseFloat(item.total_tax),
                SGST: parseFloat(item.total_tax),
                VAT: parseFloat(item.total_tax),
                totalAmount: parseFloat(item.total),
                packagingCharges: parseFloat(item.packing_charge),
                NCFlag: item.nc_flag === '1',
              })),
            },
          },
        });

        // Optionally, you can do something with the createdOrder
        console.log(`Order created with ID: ${createdOrder.id}`);
      });
    }
    return true;
  } catch (error) {
    console.error('Error sending data to DB:', error);
    return false; // Return false if there's an error
  }
};
