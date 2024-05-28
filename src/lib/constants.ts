import { token } from "@atlaskit/tokens";

export const indentPerLevel = 32;
export const iconColor = token('color.icon', '#44546F');

export type ListState = {
    items: Item[];
    lastCardMoved: {
      item: Item;
      previousIndex: number;
      currentIndex: number;
      numberOfItems: number;
    } | null;
  };

  export  type Item = {
    id: string;
    label: string;
};

export const itemKey = Symbol('item');

export type ItemData = {
    [itemKey]: true;
    item: Item;
    index: number;
    instanceId: symbol;
  };

  export type CleanupFn = () => void;

export type ItemEntry = { itemId: string; element: HTMLElement };
  