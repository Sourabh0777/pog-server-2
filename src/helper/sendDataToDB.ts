import prisma from '../config/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendDataToDb = async (response: any) => {
  try {
    for (const orderData of response) {
      const { Order, OrderItem } = orderData;
      // Validate and filter OrderItems
      let array = await Promise.all(
        OrderItem.map(async (item: any) => {
          if (!item.item_extra_data) {
            console.log(`Skipping OrderItem due to missing extra data: ${item.item_id}`);
            return;
          }

          const itemExistsById = await prisma.restaurant_new_SKU_items.findUnique({
            where: { item_id: parseInt(item.item_id) },
          });

          const itemExistsByName = await prisma.restaurant_new_SKU_items.findUnique({
            where: { name: item.name },
          });
          let createItem = null;
          if (!itemExistsById && !itemExistsByName) {
            const item_extra_data = JSON.parse(item.item_extra_data);

            // Category
            const findCategoryById = await prisma.restaurant_new_SKU_category.findUnique({ where: { c_id: parseInt(item_extra_data.c_id) } });
            const findCategoryByName = await prisma.restaurant_new_SKU_category.findUnique({ where: { c_name: item_extra_data.c_name } });
            let createCategory;
            if (!findCategoryById && !findCategoryByName) {
              createCategory = await prisma.restaurant_new_SKU_category.create({ data: { c_id: parseInt(item_extra_data.c_id), c_name: item_extra_data.c_name } });
            }

            // Group
            const findGroupById = await prisma.restaurant_new_SKU_group.findUnique({ where: { group_category_id: parseInt(item.group_category_id) } });
            const findGroupByName = await prisma.restaurant_new_SKU_group.findUnique({ where: { g_name: item_extra_data.g_name } });
            let createGroup;
            if (!findGroupById && !findGroupByName) {
              createGroup = await prisma.restaurant_new_SKU_group.create({ data: { group_category_id: parseInt(item.group_category_id), g_name: item_extra_data.g_name } });
            }

            // Varient
            const varientById = await prisma.restaurant_new_SKU_variants.findUnique({ where: { v_id: parseInt(item_extra_data.v_id) } });
            let createVarient;
            if (varientById) {
              createVarient = await prisma.restaurant_new_SKU_variants.create({ data: { v_id: item_extra_data.v_id, v_name: item_extra_data.v_name } });
            }

            //Create  Item
            createItem = prisma.restaurant_new_SKU_items.create({
              data: {
                item_id: parseInt(item.item_id),
                price: parseInt(item.price),
                name: item.name,
                old_item_id: item.old_item_id ? parseInt(item.old_item_id) : null,
                i_s_name: item_extra_data.i_s_name ? item_extra_data.i_s_name : null,
                c_id: findCategoryById?.c_id || findCategoryByName?.c_id || createCategory?.c_id,
                group_category_id: findGroupById?.group_category_id || findGroupByName?.group_category_id || createGroup?.group_category_id,
                v_id: varientById?.v_id || createVarient?.v_id,
              },
            });
          }

          return {
            item_id: itemExistsById?.item_id || itemExistsByName?.item_id || (await createItem)?.item_id,
            quantity: parseInt(item.quantity),
            price: parseInt(item.price),
            original_price: parseInt(item.original_price),
            total: parseInt(item.total),
            total_discount: parseInt(item.total_discount),
            total_tax: parseInt(item.total_tax),
          };
        })
      );
      if (array.length < 0) {
        throw new Error('No arrayy');
      }
      array = array.filter(item => {
        return item !== null && item !== undefined;
      });
      console.log('🚀 ~ sendDataToDb ~ array:', array);

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
          netAmountAfterDiscount: -parseFloat(Order.total),
          containerCharges: parseFloat(Order.packing_charge),
          deliveryCharges: parseFloat(Order.delivery_charge),
          serviceCharges: parseFloat(Order.service_charge),
          totalTax: parseFloat(Order.tax),
          totalAmount: parseFloat(Order.total),
          nonTaxableAmount: parseFloat(Order.old_total),
          CGST: parseFloat(Order.tax),
          SGST: parseFloat(Order.tax),
          VAT: parseFloat(Order.tax),
          OrderItem: {
            create: array.map((item: any) => item),
          },
        },
      });
    }
    // return true;
  } catch (error) {
    console.error('Error sending data to DB:', error);
    return false; // Return false if there's an error
  }
};
