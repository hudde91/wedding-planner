import { Component, createSignal } from "solid-js";
import {
  WeddingPlan,
  CeremonyDetails,
  ReceptionDetails,
  WeddingContactInfo,
} from "../../types";
import { formatCurrency } from "../../utils/currency";

interface WeddingDetailsProps {
  weddingPlan: WeddingPlan;
  updateWeddingDetails: (
    field: keyof WeddingPlan,
    value:
      | string
      | number
      | CeremonyDetails
      | ReceptionDetails
      | WeddingContactInfo
  ) => void;
}

const WeddingDetails: Component<WeddingDetailsProps> = (props) => {
  const [activeSection, setActiveSection] = createSignal(0);

  const updateCeremonyDetail = (
    field: keyof CeremonyDetails,
    value: string
  ) => {
    const ceremony = { ...props.weddingPlan.ceremony, [field]: value };
    props.updateWeddingDetails("ceremony", ceremony);
  };

  const updateReceptionDetail = (
    field: keyof ReceptionDetails,
    value: string
  ) => {
    const reception = { ...props.weddingPlan.reception, [field]: value };
    props.updateWeddingDetails("reception", reception);
  };

  const updateContactInfo = (
    field: keyof WeddingContactInfo,
    value: string
  ) => {
    const contactInfo = { ...props.weddingPlan.contactInfo, [field]: value };
    props.updateWeddingDetails("contactInfo", contactInfo);
  };

  const sections = [
    {
      id: 0,
      title: "Basic Details",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    },
    {
      id: 1,
      title: "Ceremony",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      id: 2,
      title: "Reception",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    },
    {
      id: 3,
      title: "Logistics",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      id: 4,
      title: "Timeline",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  return (
    <div class="space-y-8">
      {/* Hero Section */}
      <div class="animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 via-white to-purple-100 border border-rose-200/50 shadow-xl">
        <div class="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop&auto=format"
            alt="Wedding couple"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="relative z-10 p-8 md:p-12">
          <div class="max-w-3xl">
            <h1 class="text-4xl md:text-5xl font-light text-gray-800 mb-4 tracking-wide">
              Your Wedding Details
            </h1>
            <p class="text-lg text-gray-600 font-light leading-relaxed">
              Share the essential details of your special day with your guests.
              Fill out what you know now - you can always add more later!
            </p>
          </div>
        </div>

        <div class="absolute top-4 right-4 w-32 h-32 opacity-5">
          <svg viewBox="0 0 100 100" fill="currentColor" class="text-rose-300">
            <path d="M50 20c-16.569 0-30 13.431-30 30 0 20 30 30 30 30s30-10 30-30c0-16.569-13.431-30-30-30z" />
          </svg>
        </div>
      </div>

      {/* Section Navigation */}
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-lg">
        <div class="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              onClick={() => setActiveSection(section.id)}
              class={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeSection() === section.id
                  ? "bg-gradient-to-r from-rose-100 to-purple-100 text-gray-800 shadow-md border border-rose-200/60"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
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
                  stroke-width="1.5"
                  d={section.icon}
                />
              </svg>
              <span class="font-medium text-sm">{section.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Content */}
      {activeSection() === 0 && (
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Couple Information */}
          <div class="animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-400 rounded-lg flex items-center justify-center">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-medium text-gray-900">
                  Couple Information
                </h2>
                <p class="text-sm text-gray-500 font-light">
                  The stars of the show
                </p>
              </div>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Partner One *
                </label>
                <input
                  type="text"
                  value={props.weddingPlan.couple_name1}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "couple_name1",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                  placeholder="Enter first partner's name"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Partner Two *
                </label>
                <input
                  type="text"
                  value={props.weddingPlan.couple_name2}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "couple_name2",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                  placeholder="Enter second partner's name"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Wedding Hashtag
                </label>
                <input
                  type="text"
                  value={props.weddingPlan.hashtag || ""}
                  onInput={(e) =>
                    props.updateWeddingDetails("hashtag", e.currentTarget.value)
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                  placeholder="#SmithWedding2024"
                />
              </div>
            </div>
          </div>

          {/* Wedding Logistics */}
          <div class="animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-lg flex items-center justify-center">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-medium text-gray-900">
                  Wedding Logistics
                </h2>
                <p class="text-sm text-gray-500 font-light">
                  When and planning details
                </p>
              </div>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Wedding Date *
                </label>
                <input
                  type="date"
                  value={props.weddingPlan.wedding_date}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "wedding_date",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  RSVP Deadline
                </label>
                <input
                  type="date"
                  value={props.weddingPlan.rsvpDeadline || ""}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "rsvpDeadline",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Wedding Budget
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 text-lg">$</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={props.weddingPlan.budget}
                    onInput={(e) =>
                      props.updateWeddingDetails(
                        "budget",
                        Number(e.currentTarget.value) || 0
                      )
                    }
                    class="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                    placeholder="0"
                  />
                </div>
                {props.weddingPlan.budget > 0 && (
                  <p class="text-xs text-gray-500 mt-1 font-light">
                    Budget: {formatCurrency(props.weddingPlan.budget)}
                  </p>
                )}
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Dress Code
                </label>
                <select
                  value={props.weddingPlan.dressCode || ""}
                  onChange={(e) =>
                    props.updateWeddingDetails(
                      "dressCode",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                >
                  <option value="">Select dress code</option>
                  <option value="Casual">Casual</option>
                  <option value="Semi-Formal">Semi-Formal</option>
                  <option value="Cocktail Attire">Cocktail Attire</option>
                  <option value="Formal">Formal</option>
                  <option value="Black Tie">Black Tie</option>
                  <option value="Black Tie Optional">Black Tie Optional</option>
                  <option value="Beach Formal">Beach Formal</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection() === 1 && (
        <div class="animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
          <div class="flex items-center space-x-3 mb-8">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-white"
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
              <h2 class="text-2xl font-medium text-gray-900">
                Ceremony Details
              </h2>
              <p class="text-sm text-gray-500 font-light">
                Where you'll say "I do"
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={props.weddingPlan.ceremony?.venue || ""}
                  onInput={(e) =>
                    updateCeremonyDetail("venue", e.currentTarget.value)
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                  placeholder="St. Mary's Cathedral"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Address
                </label>
                <input
                  type="text"
                  value={props.weddingPlan.ceremony?.address || ""}
                  onInput={(e) =>
                    updateCeremonyDetail("address", e.currentTarget.value)
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                  placeholder="123 Main Street"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    City
                  </label>
                  <input
                    type="text"
                    value={props.weddingPlan.ceremony?.city || ""}
                    onInput={(e) =>
                      updateCeremonyDetail("city", e.currentTarget.value)
                    }
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                    placeholder="City"
                  />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    State
                  </label>
                  <input
                    type="text"
                    value={props.weddingPlan.ceremony?.state || ""}
                    onInput={(e) =>
                      updateCeremonyDetail("state", e.currentTarget.value)
                    }
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                    placeholder="State"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Start Time
                </label>
                <input
                  type="time"
                  value={props.weddingPlan.ceremony?.time || ""}
                  onInput={(e) =>
                    updateCeremonyDetail("time", e.currentTarget.value)
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Duration
                </label>
                <input
                  type="text"
                  value={props.weddingPlan.ceremony?.duration || ""}
                  onInput={(e) =>
                    updateCeremonyDetail("duration", e.currentTarget.value)
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                  placeholder="30 minutes"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Officiant
                </label>
                <input
                  type="text"
                  value={props.weddingPlan.ceremony?.officiant || ""}
                  onInput={(e) =>
                    updateCeremonyDetail("officiant", e.currentTarget.value)
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                  placeholder="Father Smith"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection() === 2 && (
        <div class="animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
          <div class="flex items-center space-x-3 mb-8">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-white"
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
            <div>
              <h2 class="text-2xl font-medium text-gray-900">
                Reception Details
              </h2>
              <p class="text-sm text-gray-500 font-light">
                Let the celebration begin!
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={props.weddingPlan.reception?.venue || ""}
                  onInput={(e) =>
                    updateReceptionDetail("venue", e.currentTarget.value)
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                  placeholder="Grand Ballroom at The Plaza"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Address
                </label>
                <input
                  type="text"
                  value={props.weddingPlan.reception?.address || ""}
                  onInput={(e) =>
                    updateReceptionDetail("address", e.currentTarget.value)
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                  placeholder="456 Oak Avenue"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    City
                  </label>
                  <input
                    type="text"
                    value={props.weddingPlan.reception?.city || ""}
                    onInput={(e) =>
                      updateReceptionDetail("city", e.currentTarget.value)
                    }
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                    placeholder="City"
                  />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    State
                  </label>
                  <input
                    type="text"
                    value={props.weddingPlan.reception?.state || ""}
                    onInput={(e) =>
                      updateReceptionDetail("state", e.currentTarget.value)
                    }
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                    placeholder="State"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={props.weddingPlan.reception?.time || ""}
                    onInput={(e) =>
                      updateReceptionDetail("time", e.currentTarget.value)
                    }
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                  />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={props.weddingPlan.reception?.endTime || ""}
                    onInput={(e) =>
                      updateReceptionDetail("endTime", e.currentTarget.value)
                    }
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Cocktail Hour
                </label>
                <input
                  type="time"
                  value={props.weddingPlan.reception?.cocktailHour || ""}
                  onInput={(e) =>
                    updateReceptionDetail("cocktailHour", e.currentTarget.value)
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Dinner Time
                </label>
                <input
                  type="time"
                  value={props.weddingPlan.reception?.dinnerTime || ""}
                  onInput={(e) =>
                    updateReceptionDetail("dinnerTime", e.currentTarget.value)
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection() === 3 && (
        <div class="space-y-8">
          <div class="animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
            <div class="flex items-center space-x-3 mb-8">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-medium text-gray-900">
                  Guest Information
                </h2>
                <p class="text-sm text-gray-500 font-light">
                  Help your guests plan their visit
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    Parking Information
                  </label>
                  <textarea
                    value={props.weddingPlan.parking || ""}
                    onInput={(e) =>
                      props.updateWeddingDetails(
                        "parking",
                        e.currentTarget.value
                      )
                    }
                    rows={3}
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light resize-none"
                    placeholder="Complimentary valet parking available..."
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    Transportation
                  </label>
                  <textarea
                    value={props.weddingPlan.transportation || ""}
                    onInput={(e) =>
                      props.updateWeddingDetails(
                        "transportation",
                        e.currentTarget.value
                      )
                    }
                    rows={3}
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light resize-none"
                    placeholder="Shuttle service provided between venues..."
                  />
                </div>
              </div>

              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    Accommodation
                  </label>
                  <textarea
                    value={props.weddingPlan.accommodation || ""}
                    onInput={(e) =>
                      props.updateWeddingDetails(
                        "accommodation",
                        e.currentTarget.value
                      )
                    }
                    rows={3}
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light resize-none"
                    placeholder="Room blocks available at Hotel Elegance..."
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    Special Instructions
                  </label>
                  <textarea
                    value={props.weddingPlan.specialInstructions || ""}
                    onInput={(e) =>
                      props.updateWeddingDetails(
                        "specialInstructions",
                        e.currentTarget.value
                      )
                    }
                    rows={3}
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light resize-none"
                    placeholder="Unplugged ceremony, accessibility notes, etc..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div class="animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-center">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-medium text-gray-900">
                  Contact Information
                </h3>
                <p class="text-sm text-gray-500 font-light">
                  For guest questions
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    Couple Email
                  </label>
                  <input
                    type="email"
                    value={props.weddingPlan.contactInfo?.coupleEmail || ""}
                    onInput={(e) =>
                      updateContactInfo("coupleEmail", e.currentTarget.value)
                    }
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                    placeholder="couple@email.com"
                  />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    Couple Phone
                  </label>
                  <input
                    type="tel"
                    value={props.weddingPlan.contactInfo?.couplePhone || ""}
                    onInput={(e) =>
                      updateContactInfo("couplePhone", e.currentTarget.value)
                    }
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    Wedding Planner
                  </label>
                  <input
                    type="text"
                    value={props.weddingPlan.contactInfo?.plannerName || ""}
                    onInput={(e) =>
                      updateContactInfo("plannerName", e.currentTarget.value)
                    }
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                    placeholder="Jane Smith Events"
                  />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 tracking-wide">
                    Planner Phone
                  </label>
                  <input
                    type="tel"
                    value={props.weddingPlan.contactInfo?.plannerPhone || ""}
                    onInput={(e) =>
                      updateContactInfo("plannerPhone", e.currentTarget.value)
                    }
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                    placeholder="(555) 987-6543"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection() === 4 && (
        <div class="animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-lg">
          <div class="flex items-center space-x-3 mb-8">
            <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-medium text-gray-900">
                Wedding Day Timeline
              </h2>
              <p class="text-sm text-gray-500 font-light">
                Optional schedule for guests
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Getting Ready
                </label>
                <input
                  type="time"
                  value={props.weddingPlan.gettingReadyTime || ""}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "gettingReadyTime",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Guest Arrival
                </label>
                <input
                  type="time"
                  value={props.weddingPlan.photosTime || ""}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "photosTime",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Ceremony Start
                </label>
                <input
                  type="time"
                  value={props.weddingPlan.ceremonyStartTime || ""}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "ceremonyStartTime",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Cocktail Hour
                </label>
                <input
                  type="time"
                  value={props.weddingPlan.cocktailStartTime || ""}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "cocktailStartTime",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Reception Start
                </label>
                <input
                  type="time"
                  value={props.weddingPlan.receptionStartTime || ""}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "receptionStartTime",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Cake Cutting
                </label>
                <input
                  type="time"
                  value={props.weddingPlan.cakeTime || ""}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "cakeTime",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Bouquet Toss
                </label>
                <input
                  type="time"
                  value={props.weddingPlan.bouquetTossTime || ""}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "bouquetTossTime",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 tracking-wide">
                  Last Dance
                </label>
                <input
                  type="time"
                  value={props.weddingPlan.lastDanceTime || ""}
                  onInput={(e) =>
                    props.updateWeddingDetails(
                      "lastDanceTime",
                      e.currentTarget.value
                    )
                  }
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm font-light"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-save Indicator */}
      <div class="animate-fade-in-up-delay-800 text-center">
        <div class="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-100 shadow-sm">
          <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span class="text-sm text-gray-600 font-light">
            Changes saved automatically
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeddingDetails;
