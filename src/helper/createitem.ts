// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createItem = async (item: any) => {
  const item_extra_data = JSON.parse(item.item_extra_data);
  if (!item_extra_data) {
    return;
  }

  return item;
};
