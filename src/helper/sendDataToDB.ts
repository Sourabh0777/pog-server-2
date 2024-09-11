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

          // Create Restaurant
          let findRestaurant = await prisma.newRestaurant.findUnique({ where: { restaurant_id: parseInt(item.restaurant_id) } });
          let createRestaurant;
          if (!findRestaurant) {
            createRestaurant = await prisma.newRestaurant.create({ data: { restaurant_id: parseInt(item.restaurant_id) } });
          }

          const restaurantId = findRestaurant?.restaurant_id || createRestaurant?.restaurant_id;
          if (!restaurantId) {
            throw new Error('Restaurant ID is undefined');
          }

          const itemExistsById = await prisma.restaurant_new_SKU_items.findFirst({
            where: { restaurant_id: restaurantId, item_id: parseInt(item.item_id) },
          });
          const itemExistsByName = await prisma.restaurant_new_SKU_items.findFirst({
            where: { restaurant_id: restaurantId, name: item.name },
          });
          let createItem = null;

          if (!itemExistsById && !itemExistsByName) {
            const item_extra_data = JSON.parse(item.item_extra_data);
            if (!item_extra_data) {
              return;
            }
            // Create Restaurant
            let findRestaurant = await prisma.newRestaurant.findUnique({ where: { restaurant_id: parseInt(item.restaurant_id) } });
            let createRestaurant;
            if (!findRestaurant) {
              createRestaurant = await prisma.newRestaurant.create({ data: { restaurant_id: parseInt(item.restaurant_id) } });
            }
            const restaurantId = findRestaurant?.restaurant_id || createRestaurant?.restaurant_id;
            if (!restaurantId) {
              throw new Error('Restaurant ID is undefined');
            }

            // Group
            const findGroupById = await prisma.restaurant_new_SKU_group.findFirst({ where: { restaurant_id: restaurantId, group_category_id: parseInt(item.group_category_id) } });
            const findGroupByName = await prisma.restaurant_new_SKU_group.findFirst({ where: { restaurant_id: restaurantId, g_name: item_extra_data.g_name } });
            let createGroup;
            if (!findGroupById && !findGroupByName) {
              createGroup = await prisma.restaurant_new_SKU_group.create({
                data: { group_category_id: parseInt(item.group_category_id), g_name: item_extra_data.g_name, restaurant_id: restaurantId },
              });
              console.log('🚀 ~ orderData.OrderItem.map ~ createGroup:', createGroup);
            }
            // Category
            const findCategoryById = await prisma.restaurant_new_SKU_category.findFirst({ where: { restaurant_id: restaurantId, c_id: parseInt(item_extra_data.c_id) } });
            const findCategoryByName = await prisma.restaurant_new_SKU_category.findFirst({ where: { restaurant_id: restaurantId, c_name: item_extra_data.c_name } });
            let createCategory;
            if (!findCategoryById && !findCategoryByName) {
              createCategory = await prisma.restaurant_new_SKU_category.create({
                data: { c_id: parseInt(item_extra_data.c_id), c_name: item_extra_data.c_name, restaurant_id: restaurantId },
              });
              console.log('🚀 ~ orderData.OrderItem.map ~ createCategory:', createCategory);
            }

            // Varient
            const varientById = await prisma.restaurant_new_SKU_variants.findFirst({ where: { v_id: parseInt(item_extra_data.v_id) } });
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
                restaurant_id: restaurantId,
                old_item_id: parseInt(item.old_item_id),
                i_s_name: item_extra_data.i_s_name,
                c_id: findCategoryById?.id || findCategoryByName?.id || createCategory?.id,
                group_category_id: findGroupById?.id || findGroupByName?.id || createGroup?.id,
                v_id: varientById?.id || createVarient?.id,
              },
            });
          }

          return {
            item_id: itemExistsById?.id || itemExistsByName?.id || (await createItem)?.id,
            quantity: parseInt(item.quantity),
            price: parseInt(item.price),
            original_price: parseInt(item.original_price),
            total: parseInt(item.total),
            total_discount: parseInt(item.total_discount),
            total_tax: parseInt(item.total_tax),
            restaurantID: restaurantId,
          };
        })
      );
      if (array.length < 0) {
        throw new Error('No arrayy');
      }
      array = array.filter(item => {
        return item !== null && item !== undefined;
      });

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
      console.log('🚀 ~ sendDataToDb ~ createdOrder:', createdOrder);
    }
    return true;
  } catch (error) {
    console.error('Error sending data to DB:', error);
    return false; // Return false if there's an error
  }
};
