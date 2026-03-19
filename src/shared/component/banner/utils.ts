import type {
 SectionItem,
 SectionItemManual,
} from"@/features/home/types";

function isManualItem(item: SectionItem): item is SectionItemManual {
 return"item"in item &&"link"in item;
}

export function getItemData(item: SectionItem) {
 if (isManualItem(item)) {
 return item.item;
 }
 return item;
}
