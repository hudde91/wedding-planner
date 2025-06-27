import { Component } from "solid-js";
import type { WishlistItem, WeddingPlan } from "../../types";
import Wishlist from "../wishlist/Wishlist";

interface GuestWishlistProps {
  wishlistItems: WishlistItem[];
  onUpdateWishlistItem: (id: string, updates: Partial<WishlistItem>) => void;
  weddingPlan?: WeddingPlan;
}

const GuestWishlist: Component<GuestWishlistProps> = (props) => {
  const coupleNames = () => {
    if (props.weddingPlan?.couple_name1 && props.weddingPlan?.couple_name2) {
      return {
        name1: props.weddingPlan.couple_name1,
        name2: props.weddingPlan.couple_name2,
      };
    }
    return undefined;
  };

  return (
    <Wishlist
      wishlistItems={props.wishlistItems}
      onUpdateWishlistItem={props.onUpdateWishlistItem}
      mode="guest"
      coupleNames={coupleNames()}
    />
  );
};

export default GuestWishlist;
