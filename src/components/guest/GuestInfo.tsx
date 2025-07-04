import { Component, Show, For } from "solid-js";
import type { WeddingPlan } from "../../types";

interface GuestInfoProps {
  weddingPlan: WeddingPlan;
}

const GuestInfo: Component<GuestInfoProps> = (props) => {
  const hasBasicInfo = () => {
    return (
      props.weddingPlan.wedding_date &&
      props.weddingPlan.couple_name1 &&
      props.weddingPlan.couple_name2
    );
  };

  const hasCeremonyInfo = () => {
    return (
      props.weddingPlan.ceremony?.venue ||
      props.weddingPlan.ceremony?.address ||
      props.weddingPlan.ceremony?.time
    );
  };

  const hasReceptionInfo = () => {
    return (
      props.weddingPlan.reception?.venue ||
      props.weddingPlan.reception?.address ||
      props.weddingPlan.reception?.time
    );
  };

  const getFullAddress = (location: any) => {
    if (!location) return "";
    const parts = [
      location.address,
      location.city,
      location.state,
      location.zipCode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const formatTime = (time?: string) => {
    if (!time) return "";
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return time;
    }
  };

  // Generate schedule from wedding plan data
  const getSchedule = () => {
    const schedule = [];

    if (props.weddingPlan.photosTime) {
      schedule.push({
        time: formatTime(props.weddingPlan.photosTime),
        event: "Guest Arrival & Seating",
        location: props.weddingPlan.ceremony?.venue || "Ceremony Venue",
      });
    }

    if (
      props.weddingPlan.ceremonyStartTime ||
      props.weddingPlan.ceremony?.time
    ) {
      schedule.push({
        time: formatTime(
          props.weddingPlan.ceremonyStartTime ||
            props.weddingPlan.ceremony?.time
        ),
        event: "Wedding Ceremony",
        location: props.weddingPlan.ceremony?.venue || "Ceremony Venue",
      });
    }

    if (
      props.weddingPlan.cocktailStartTime ||
      props.weddingPlan.reception?.cocktailHour
    ) {
      schedule.push({
        time: formatTime(
          props.weddingPlan.cocktailStartTime ||
            props.weddingPlan.reception?.cocktailHour
        ),
        event: "Cocktail Hour",
        location: props.weddingPlan.reception?.venue || "Reception Venue",
      });
    }

    if (
      props.weddingPlan.receptionStartTime ||
      props.weddingPlan.reception?.time
    ) {
      schedule.push({
        time: formatTime(
          props.weddingPlan.receptionStartTime ||
            props.weddingPlan.reception?.time
        ),
        event: "Reception Begins",
        location: props.weddingPlan.reception?.venue || "Reception Venue",
      });
    }

    if (props.weddingPlan.reception?.dinnerTime) {
      schedule.push({
        time: formatTime(props.weddingPlan.reception?.dinnerTime),
        event: "Dinner Service",
        location: props.weddingPlan.reception?.venue || "Reception Venue",
      });
    }

    if (props.weddingPlan.cakeTime) {
      schedule.push({
        time: formatTime(props.weddingPlan.cakeTime),
        event: "Cake Cutting",
        location: props.weddingPlan.reception?.venue || "Reception Venue",
      });
    }

    if (props.weddingPlan.lastDanceTime) {
      schedule.push({
        time: formatTime(props.weddingPlan.lastDanceTime),
        event: "Last Dance",
        location: props.weddingPlan.reception?.venue || "Reception Venue",
      });
    }

    if (props.weddingPlan.reception?.endTime) {
      schedule.push({
        time: formatTime(props.weddingPlan.reception?.endTime),
        event: "Reception Ends",
        location: props.weddingPlan.reception?.venue || "Reception Venue",
      });
    }

    return schedule.length > 0
      ? schedule
      : [
          {
            time: "Details",
            event: "Coming Soon",
            location: "The couple is still finalizing the schedule",
          },
        ];
  };

  const importantNotes = () => {
    const notes = [];

    if (props.weddingPlan.rsvpDeadline) {
      notes.push({
        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
        title: "RSVP Required",
        text: `Please confirm your attendance by ${new Date(
          props.weddingPlan.rsvpDeadline
        ).toLocaleDateString()} to help us plan accordingly.`,
      });
    }

    if (props.weddingPlan.specialInstructions) {
      notes.push({
        icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        title: "Special Instructions",
        text: props.weddingPlan.specialInstructions,
      });
    }

    if (props.weddingPlan.dressCode) {
      notes.push({
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        title: "Dress Code",
        text: `Please dress in ${props.weddingPlan.dressCode} attire.`,
      });
    }

    // Default note if no specific instructions
    if (notes.length === 0) {
      notes.push({
        icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
        title: "Accessibility",
        text: "Please let us know if you have any special accessibility needs.",
      });
    }

    return notes;
  };

  return (
    <div class="space-y-6 sm:space-y-8">
      {/* Wedding Date & Basic Info */}
      <Show
        when={hasBasicInfo()}
        fallback={
          <div class="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-100/50 p-6 sm:p-8 text-center">
            <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-rose-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg mb-4">
              <svg
                class="w-6 h-6 sm:w-8 sm:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 class="text-xl sm:text-2xl font-light text-gray-800 mb-2">
              Wedding Details Coming Soon
            </h2>
            <p class="text-gray-600 text-sm sm:text-base">
              The happy couple is still finalizing the details. Check back soon!
            </p>
          </div>
        }
      >
        <div class="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-rose-100/50 p-6 sm:p-8">
          <div class="text-center space-y-4 sm:space-y-6">
            <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-rose-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
              <svg
                class="w-6 h-6 sm:w-8 sm:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div class="space-y-2">
              <h2 class="text-2xl sm:text-3xl font-light text-gray-800">
                {new Date(props.weddingPlan.wedding_date).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </h2>
              <Show when={props.weddingPlan.ceremony?.time}>
                <p class="text-base sm:text-lg text-gray-600 font-light">
                  Ceremony at {formatTime(props.weddingPlan.ceremony?.time)}
                </p>
              </Show>
            </div>
          </div>
        </div>
      </Show>

      {/* Ceremony & Reception Details */}
      <Show when={hasCeremonyInfo() || hasReceptionInfo()}>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Ceremony */}
          <Show when={hasCeremonyInfo()}>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-blue-100/50 p-4 sm:p-6">
              <div class="space-y-3 sm:space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-lg sm:text-xl font-medium text-gray-800">
                      Ceremony
                    </h3>
                    <Show when={props.weddingPlan.ceremony?.time}>
                      <p class="text-sm sm:text-base text-blue-600 font-medium">
                        {formatTime(props.weddingPlan.ceremony?.time)}
                      </p>
                    </Show>
                  </div>
                </div>
                <div class="space-y-2 text-sm text-gray-600">
                  <Show when={props.weddingPlan.ceremony?.venue}>
                    <p class="font-medium">
                      {props.weddingPlan.ceremony?.venue}
                    </p>
                  </Show>
                  <Show when={getFullAddress(props.weddingPlan.ceremony)}>
                    <p class="break-words">
                      {getFullAddress(props.weddingPlan.ceremony)}
                    </p>
                  </Show>
                  <Show when={props.weddingPlan.ceremony?.duration}>
                    <p class="text-gray-500">
                      Duration: {props.weddingPlan.ceremony?.duration}
                    </p>
                  </Show>
                  <Show when={props.weddingPlan.ceremony?.officiant}>
                    <p class="text-gray-500">
                      Officiant: {props.weddingPlan.ceremony?.officiant}
                    </p>
                  </Show>
                  <Show when={props.weddingPlan.dressCode}>
                    <p class="text-gray-500">
                      Dress Code: {props.weddingPlan.dressCode}
                    </p>
                  </Show>
                </div>
              </div>
            </div>
          </Show>

          {/* Reception */}
          <Show when={hasReceptionInfo()}>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-purple-100/50 p-4 sm:p-6">
              <div class="space-y-3 sm:space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-lg sm:text-xl font-medium text-gray-800">
                      Reception
                    </h3>
                    <Show when={props.weddingPlan.reception?.time}>
                      <p class="text-sm sm:text-base text-purple-600 font-medium">
                        {formatTime(props.weddingPlan.reception?.time)}
                      </p>
                    </Show>
                  </div>
                </div>
                <div class="space-y-2 text-sm text-gray-600">
                  <Show when={props.weddingPlan.reception?.venue}>
                    <p class="font-medium">
                      {props.weddingPlan.reception?.venue}
                    </p>
                  </Show>
                  <Show when={getFullAddress(props.weddingPlan.reception)}>
                    <p class="break-words">
                      {getFullAddress(props.weddingPlan.reception)}
                    </p>
                  </Show>
                  <Show when={props.weddingPlan.reception?.cocktailHour}>
                    <p class="text-gray-500">
                      Cocktail Hour:{" "}
                      {formatTime(props.weddingPlan.reception?.cocktailHour)}
                    </p>
                  </Show>
                  <Show when={props.weddingPlan.reception?.dinnerTime}>
                    <p class="text-gray-500">
                      Dinner:{" "}
                      {formatTime(props.weddingPlan.reception?.dinnerTime)}
                    </p>
                  </Show>
                  <Show when={props.weddingPlan.reception?.endTime}>
                    <p class="text-gray-500">
                      Ends: {formatTime(props.weddingPlan.reception?.endTime)}
                    </p>
                  </Show>
                </div>
              </div>
            </div>
          </Show>
        </div>
      </Show>

      {/* Schedule */}
      <div class="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-rose-100/50 p-4 sm:p-6">
        <h3 class="text-xl sm:text-2xl font-light text-gray-800 mb-4 sm:mb-6 text-center">
          Wedding Day Schedule
        </h3>
        <div class="space-y-3 sm:space-y-4">
          <For each={getSchedule()}>
            {(item) => (
              <div class="flex items-start space-x-3 sm:space-x-4 p-3 rounded-lg hover:bg-rose-50/50 transition-colors">
                <div class="w-16 sm:w-20 text-xs sm:text-sm font-medium text-gray-700 flex-shrink-0">
                  {item.time}
                </div>
                <div class="w-1 h-6 bg-rose-300 rounded-full flex-shrink-0"></div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-800 text-sm sm:text-base">
                    {item.event}
                  </p>
                  <p class="text-xs sm:text-sm text-gray-600 break-words">
                    {item.location}
                  </p>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Important Information */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <For each={importantNotes()}>
          {(note) => (
            <div class="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm border border-gray-100/50 p-3 sm:p-4">
              <div class="space-y-2 sm:space-y-3">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-rose-400 to-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    class="w-3 h-3 sm:w-4 sm:h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d={note.icon}
                    />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800 text-sm">
                    {note.title}
                  </h4>
                  <p class="text-xs text-gray-600 leading-relaxed">
                    {note.text}
                  </p>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Additional Details */}
      <Show
        when={
          props.weddingPlan.parking ||
          props.weddingPlan.transportation ||
          props.weddingPlan.accommodation
        }
      >
        <div class="bg-gradient-to-r from-rose-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-rose-100/50 p-4 sm:p-6">
          <h3 class="text-lg sm:text-xl font-medium text-gray-800 mb-3 sm:mb-4">
            Additional Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-600">
            <div class="space-y-2">
              <Show when={props.weddingPlan.parking}>
                <p class="break-words">
                  <span class="font-medium">Parking:</span>{" "}
                  {props.weddingPlan.parking}
                </p>
              </Show>
              <Show when={props.weddingPlan.transportation}>
                <p class="break-words">
                  <span class="font-medium">Transportation:</span>{" "}
                  {props.weddingPlan.transportation}
                </p>
              </Show>
            </div>
            <div class="space-y-2">
              <Show when={props.weddingPlan.accommodation}>
                <p class="break-words">
                  <span class="font-medium">Accommodation:</span>{" "}
                  {props.weddingPlan.accommodation}
                </p>
              </Show>
            </div>
          </div>
        </div>
      </Show>

      {/* Contact Information */}
      <Show
        when={
          props.weddingPlan.contactInfo?.coupleEmail ||
          props.weddingPlan.contactInfo?.plannerName
        }
      >
        <div class="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-100/50 p-4 sm:p-6">
          <h3 class="text-lg sm:text-xl font-medium text-gray-800 mb-3 sm:mb-4">
            Contact Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-600">
            <Show when={props.weddingPlan.contactInfo?.coupleEmail}>
              <div>
                <p class="font-medium text-gray-700">Happy Couple</p>
                <p class="break-all">
                  {props.weddingPlan.contactInfo?.coupleEmail}
                </p>
                <Show when={props.weddingPlan.contactInfo?.couplePhone}>
                  <p>{props.weddingPlan.contactInfo?.couplePhone}</p>
                </Show>
              </div>
            </Show>
            <Show when={props.weddingPlan.contactInfo?.plannerName}>
              <div>
                <p class="font-medium text-gray-700">Wedding Planner</p>
                <p>{props.weddingPlan.contactInfo?.plannerName}</p>
                <Show when={props.weddingPlan.contactInfo?.plannerPhone}>
                  <p>{props.weddingPlan.contactInfo?.plannerPhone}</p>
                </Show>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default GuestInfo;
