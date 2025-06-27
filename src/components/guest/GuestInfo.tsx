import { Component, Show } from "solid-js";
import type { WeddingPlan } from "../../types";

interface GuestInfoProps {
  weddingPlan: WeddingPlan;
}

const GuestInfo: Component<GuestInfoProps> = (props) => {
  // Mock venue and schedule data - in a real app, this would come from the wedding plan
  const weddingInfo = {
    ceremony: {
      time: "4:00 PM",
      venue: "St. Mary's Cathedral",
      address: "123 Main Street, City, State 12345",
      dresscode: "Formal Attire",
    },
    reception: {
      time: "6:00 PM",
      venue: "Grand Ballroom at The Plaza",
      address: "456 Oak Avenue, City, State 12345",
      details: "Dinner, Dancing & Celebration",
    },
    parking: "Complimentary valet parking available at both venues",
    accommodation:
      "Room blocks available at Hotel Elegance (mention our wedding for discount)",
    transportation:
      "Shuttle service provided between ceremony and reception venues",
  };

  const schedule = [
    {
      time: "3:30 PM",
      event: "Guest Arrival & Seating",
      location: "Ceremony Venue",
    },
    {
      time: "4:00 PM",
      event: "Wedding Ceremony",
      location: "St. Mary's Cathedral",
    },
    { time: "4:30 PM", event: "Cocktail Hour", location: "Cathedral Gardens" },
    {
      time: "5:30 PM",
      event: "Venue Transition",
      location: "Shuttle to Reception",
    },
    { time: "6:00 PM", event: "Reception Begins", location: "Grand Ballroom" },
    { time: "7:00 PM", event: "Dinner Service", location: "Grand Ballroom" },
    {
      time: "8:30 PM",
      event: "First Dance & Dancing",
      location: "Grand Ballroom",
    },
    { time: "11:00 PM", event: "Reception Ends", location: "Grand Ballroom" },
  ];

  const importantNotes = [
    {
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      title: "RSVP Required",
      text: "Please confirm your attendance by [date] to help us plan accordingly.",
    },
    {
      icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Unplugged Ceremony",
      text: "We kindly ask that you keep phones and cameras away during the ceremony so our photographer can capture the perfect moments.",
    },
    {
      icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
      title: "Accessibility",
      text: "Both venues are wheelchair accessible. Please let us know if you have any special accessibility needs.",
    },
  ];

  return (
    <div class="space-y-8">
      {/* Wedding Date & Basic Info */}
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100/50 p-8">
        <div class="text-center space-y-6">
          <div class="w-16 h-16 mx-auto bg-gradient-to-br from-rose-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
            <svg
              class="w-8 h-8 text-white"
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

          <Show when={props.weddingPlan.wedding_date}>
            <div class="space-y-2">
              <h2 class="text-3xl font-light text-gray-800">
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
              <p class="text-lg text-gray-600 font-light">
                {new Date(props.weddingPlan.wedding_date).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                  }
                )}{" "}
                • {weddingInfo.ceremony.time}
              </p>
            </div>
          </Show>
        </div>
      </div>

      {/* Ceremony & Reception Details */}
      <div class="grid md:grid-cols-2 gap-6">
        {/* Ceremony */}
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 p-6">
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white"
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
              <div>
                <h3 class="text-xl font-medium text-gray-800">Ceremony</h3>
                <p class="text-blue-600 font-medium">
                  {weddingInfo.ceremony.time}
                </p>
              </div>
            </div>
            <div class="space-y-2 text-sm text-gray-600">
              <p class="font-medium">{weddingInfo.ceremony.venue}</p>
              <p>{weddingInfo.ceremony.address}</p>
              <p class="text-gray-500">
                Dress Code: {weddingInfo.ceremony.dresscode}
              </p>
            </div>
          </div>
        </div>

        {/* Reception */}
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100/50 p-6">
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-medium text-gray-800">Reception</h3>
                <p class="text-purple-600 font-medium">
                  {weddingInfo.reception.time}
                </p>
              </div>
            </div>
            <div class="space-y-2 text-sm text-gray-600">
              <p class="font-medium">{weddingInfo.reception.venue}</p>
              <p>{weddingInfo.reception.address}</p>
              <p class="text-gray-500">{weddingInfo.reception.details}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100/50 p-6">
        <h3 class="text-2xl font-light text-gray-800 mb-6 text-center">
          Wedding Day Schedule
        </h3>
        <div class="space-y-4">
          {schedule.map((item) => (
            <div class="flex items-center space-x-4 p-3 rounded-lg hover:bg-rose-50/50 transition-colors">
              <div class="w-20 text-sm font-medium text-gray-700 flex-shrink-0">
                {item.time}
              </div>
              <div class="w-1 h-6 bg-rose-300 rounded-full"></div>
              <div class="flex-1">
                <p class="font-medium text-gray-800">{item.event}</p>
                <p class="text-sm text-gray-600">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Information */}
      <div class="grid md:grid-cols-3 gap-4">
        {importantNotes.map((note) => (
          <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100/50 p-4">
            <div class="space-y-3">
              <div class="w-8 h-8 bg-gradient-to-br from-rose-400 to-purple-400 rounded-lg flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-white"
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
                <h4 class="font-medium text-gray-800 text-sm">{note.title}</h4>
                <p class="text-xs text-gray-600 leading-relaxed">{note.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Details */}
      <div class="bg-gradient-to-r from-rose-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl border border-rose-100/50 p-6">
        <h3 class="text-xl font-medium text-gray-800 mb-4">
          Additional Information
        </h3>
        <div class="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div class="space-y-2">
            <p>
              <span class="font-medium">Parking:</span> {weddingInfo.parking}
            </p>
            <p>
              <span class="font-medium">Transportation:</span>{" "}
              {weddingInfo.transportation}
            </p>
          </div>
          <div class="space-y-2">
            <p>
              <span class="font-medium">Accommodation:</span>{" "}
              {weddingInfo.accommodation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestInfo;
