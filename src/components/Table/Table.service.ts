import { RowData } from 'src/types';

export function deleteFromTree(data: RowData[], idToDelete: number): RowData[] {
  return data
    .filter((item) => item.id !== idToDelete)
    .map((item) => ({
      ...item,
      child: deleteFromTree(item.child, idToDelete),
    }));
}

export const updateTree = (
  data: RowData[],
  updatedItems: RowData[]
): RowData[] => {
  return data.map((item: RowData) => {
    const updatedItem = updatedItems.find((updated) => updated.id === item.id);
    if (updatedItem) {
      return {
        ...item,
        ...updatedItem,
        child: updateTree(item.child, updatedItems),
      };
    }

    return {
      ...item,
      child: updateTree(item.child, updatedItems),
    };
  });
};
export const addTree = (
  data: RowData[],
  newItem: RowData,
  parentId: number | null = null
): RowData[] => {
  if (parentId === null) {
    return [...data, newItem];
  }

  return data.map((item) => {
    if (item.id === parentId) {
      return {
        ...item,
        child: [...(item.child || []), newItem],
      };
    }

    return {
      ...item,
      child: item.child ? addTree(item.child, newItem, parentId) : [],
    };
  });
};
