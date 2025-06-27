import { Component, Show, createSignal } from "solid-js";
import { WishlistItem as WishlistItemType } from "../../types";
import { formatCurrency } from "../../utils/currency";

interface WishlistItemProps {
  item: WishlistItemType;
  onEdit?: (item: WishlistItemType) => void;
  onDelete?: (itemId: string) => void;
  onReserve?: (id: string, reservedBy: string, notes?: string) => void;
  mode?: "couple" | "guest";
}

const WishlistItem: Component<WishlistItemProps> = (props) => {
  const [showReservationModal, setShowReservationModal] = createSignal(false);
  const [guestName, setGuestName] = createSignal("");
  const [guestEmail, setGuestEmail] = createSignal("");
  const [reservationNotes, setReservationNotes] = createSignal("");

  const mode = () => props.mode || "couple";
  const isCoupleMode = () => mode() === "couple";
  const isGuestMode = () => mode() === "guest";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "reserved":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "purchased":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleDelete = () => {
    if (
      props.onDelete &&
      confirm("Are you sure you want to remove this item from your wishlist?")
    ) {
      props.onDelete(props.item.id);
    }
  };

  const handleReserve = () => {
    if (isGuestMode() && props.item.status === "available") {
      setShowReservationModal(true);
      setGuestName("");
      setGuestEmail("");
      setReservationNotes("");
    }
  };

  const confirmReservation = () => {
    if (!guestName().trim() || !props.onReserve) return;

    props.onReserve(
      props.item.id,
      guestName(),
      reservationNotes() || undefined
    );
    setShowReservationModal(false);
  };

  const cancelReservation = () => {
    setShowReservationModal(false);
  };

  return (
    <>
      <div class="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image */}
        <div class="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          <Show
            when={props.item.image_url}
            fallback={
              <div class="absolute inset-0 flex items-center justify-center">
                <svg
                  class="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            }
          >
            <img
              src={props.item.image_url}
              alt={props.item.title}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </Show>

          {/* Status Badge */}
          <div class="absolute top-3 right-3">
            <div
              class={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                props.item.status
              )} shadow-sm`}
            >
              {props.item.status.charAt(0).toUpperCase() +
                props.item.status.slice(1)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div class="p-6 space-y-4">
          {/* Header with title and action buttons */}
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900 mb-2 line-clamp-2 pr-4">
                {props.item.title}
              </h3>
              <Show when={props.item.notes && props.item.notes.trim()}>
                <p class="text-sm text-gray-600 font-light line-clamp-2 leading-relaxed">
                  {props.item.notes}
                </p>
              </Show>
            </div>

            {/* Action buttons - Only show for couple mode */}
            <Show when={isCoupleMode()}>
              <div class="flex space-x-2 ml-2">
                <Show when={props.onEdit}>
                  <button
                    onClick={() => props.onEdit!(props.item)}
                    class="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                    title="Edit item"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                </Show>
                <Show when={props.onDelete}>
                  <button
                    onClick={handleDelete}
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete item"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </Show>
              </div>
            </Show>
          </div>

          <div class="text-2xl font-light text-gray-900">
            {formatCurrency(props.item.price)}
          </div>

          {/* Product URL - Show for both modes */}
          <Show when={props.item.product_url}>
            <a
              href={props.item.product_url}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors duration-200 font-light"
            >
              <span>View Product</span>
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </Show>

          {/* Reserved status - Show for both modes */}
          <Show when={props.item.reserved_by}>
            <div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p class="text-sm text-amber-800 font-light">
                Reserved by{" "}
                <span class="font-medium">{props.item.reserved_by}</span>
              </p>
              <Show when={props.item.reserved_at}>
                <p class="text-xs text-amber-600 mt-1">
                  {new Date(props.item.reserved_at!).toLocaleDateString()}
                </p>
              </Show>
            </div>
          </Show>

          {/* Guest reserve button */}
          <Show
            when={
              isGuestMode() &&
              props.item.status === "available" &&
              props.onReserve
            }
          >
            <button
              onClick={handleReserve}
              class="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-lg hover:from-purple-600 hover:to-rose-600 transition-all duration-300 font-medium shadow-sm"
            >
              Reserve This Gift
            </button>
          </Show>
        </div>
      </div>

      {/* Reservation Modal - Only for guest mode */}
      <Show when={showReservationModal()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div class="space-y-6">
              <div class="text-center">
                <h3 class="text-2xl font-medium text-gray-800">Reserve Gift</h3>
                <p class="text-gray-600 mt-2">
                  Reserve "{props.item.title}" for the happy couple
                </p>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={guestName()}
                    onInput={(e) => setGuestName(e.currentTarget.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={guestEmail()}
                    onInput={(e) => setGuestEmail(e.currentTarget.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Special Message (Optional)
                  </label>
                  <textarea
                    value={reservationNotes()}
                    onInput={(e) => setReservationNotes(e.currentTarget.value)}
                    rows={3}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Add a special message for the couple..."
                  />
                </div>
              </div>

              <div class="flex space-x-3">
                <button
                  onClick={cancelReservation}
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReservation}
                  disabled={!guestName().trim()}
                  class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-lg hover:from-purple-600 hover:to-rose-600 transition-all duration-300 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reserve Gift
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default WishlistItem;
