import {
  Component,
  Show,
  createSignal,
  createEffect,
  onCleanup,
} from "solid-js";
import { TodoItem as TodoItemType, TodoFormData } from "../../types";
import PinterestInspirations from "./PinterestInspirations";
import type { PinterestPin } from "../../types";
import { formatCurrency } from "../../utils/currency";
import { formatCompactDate } from "../../utils/date";
import { getPaymentStatusStyle, PaymentStatus } from "../../utils/status";
import {
  formatPhoneNumber,
  validatePhoneNumber,
  validateEmail,
} from "../../utils/validation";

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isExpanded: boolean;
  onToggleExpanded: (id: number) => void;
  onUpdateDetails: (id: number, todoData: TodoFormData) => void;
  focusOnExpand?: boolean;
}

const TodoItem: Component<TodoItemProps> = (props) => {
  const [todoFormData, setTodoFormData] = createSignal<TodoFormData>({
    cost: props.todo.cost,
    vendor_name: props.todo.vendor_name || "",
    vendor_contact: props.todo.vendor_contact || "",
    vendor_email: props.todo.vendor_email || "",
    vendor_phone: props.todo.vendor_phone || "",
    notes: props.todo.notes || "",
  });

  const [showInspirations, setShowInspirations] = createSignal(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = createSignal(false);
  const [initialFormData, setInitialFormData] = createSignal<TodoFormData>({
    cost: props.todo.cost,
    vendor_name: props.todo.vendor_name || "",
    vendor_contact: props.todo.vendor_contact || "",
    vendor_email: props.todo.vendor_email || "",
    vendor_phone: props.todo.vendor_phone || "",
    notes: props.todo.notes || "",
  });

  let formContainerRef: HTMLDivElement | undefined;
  let firstInputRef: HTMLInputElement | undefined;

  // Update form data when todo props change
  createEffect(() => {
    const currentTodo = props.todo;
    const newFormData = {
      cost: currentTodo.cost,
      vendor_name: currentTodo.vendor_name || "",
      vendor_contact: currentTodo.vendor_contact || "",
      vendor_email: currentTodo.vendor_email || "",
      vendor_phone: currentTodo.vendor_phone || "",
      notes: currentTodo.notes || "",
    };

    setTodoFormData(newFormData);
    setInitialFormData(newFormData);
    setHasUnsavedChanges(false);
  });

  // Focus first input when expanded (for new todos)
  createEffect(() => {
    if (props.isExpanded && props.focusOnExpand && firstInputRef) {
      // Small delay to ensure the animation has started
      setTimeout(() => {
        firstInputRef?.focus();
      }, 100);
    }
  });

  // Check for unsaved changes
  createEffect(() => {
    const currentData = todoFormData();
    const initial = initialFormData();
    const hasChanged = JSON.stringify(currentData) !== JSON.stringify(initial);
    setHasUnsavedChanges(hasChanged);
  });

  // Save function
  const saveChanges = () => {
    if (!hasUnsavedChanges()) return;

    try {
      const currentData = todoFormData();
      props.onUpdateDetails(props.todo.id, currentData);
      setInitialFormData(currentData);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving todo details:", error);
    }
  };

  // Handle outside clicks to save
  const handleOutsideClick = (e: MouseEvent) => {
    if (
      props.isExpanded &&
      formContainerRef &&
      !formContainerRef.contains(e.target as Node) &&
      hasUnsavedChanges()
    ) {
      saveChanges();
    }
  };

  // Set up outside click listener when expanded
  createEffect(() => {
    if (props.isExpanded) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  });

  onCleanup(() => {
    document.removeEventListener("mousedown", handleOutsideClick);
  });

  const isValidVendorEmail = () =>
    validateEmail(todoFormData().vendor_email || "");
  const isValidVendorPhone = () =>
    validatePhoneNumber(todoFormData().vendor_phone || "");

  const getTodoCostDisplay = (todo: TodoItemType): string => {
    if (typeof todo.cost === "number" && todo.cost > 0) {
      return formatCurrency(todo.cost);
    }
    return "";
  };

  const updateFormField = <K extends keyof TodoFormData>(
    field: K,
    value: TodoFormData[K]
  ): void => {
    setTodoFormData((prev) => {
      if (prev[field] === value) {
        return prev;
      }
      return { ...prev, [field]: value };
    });
  };

  // Handle input blur - save changes
  const handleInputBlur = () => {
    if (hasUnsavedChanges()) {
      saveChanges();
    }
  };

  // Handle phone number formatting and save on blur
  const handlePhoneBlur = (e: FocusEvent) => {
    const target = e.target as HTMLInputElement;
    const formatted = formatPhoneNumber(target.value);
    if (formatted !== target.value) {
      updateFormField("vendor_phone", formatted);
    }
    // Save after formatting
    setTimeout(() => {
      if (hasUnsavedChanges()) {
        saveChanges();
      }
    }, 10);
  };

  const handleGetInspiration = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    setShowInspirations(true);
  };

  const handleCloseInspirations = (): void => {
    setShowInspirations(false);
  };

  const handleInspirationSelect = (pin: PinterestPin): void => {
    const currentNotes = todoFormData().notes || "";
    const inspirationNote = `\n\n💡 Inspiration: ${pin.title}\n${pin.description}\nSaved from: ${pin.link}`;
    const updatedNotes = currentNotes + inspirationNote;

    updateFormField("notes", updatedNotes);
    setShowInspirations(false);
  };

  const handleToggleExpanded = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    // Save changes before collapsing
    if (props.isExpanded && hasUnsavedChanges()) {
      saveChanges();
    }

    props.onToggleExpanded(props.todo.id);
  };

  const handleToggleComplete = (e: Event): void => {
    e.stopPropagation();
    props.onToggle(props.todo.id);
  };

  const handleDelete = (e: MouseEvent): void => {
    e.stopPropagation();
    props.onDelete(props.todo.id);
  };

  const getCompletionStatus = () => {
    if (props.todo.completed) {
      return {
        bgColor: "bg-emerald-50/50 border-emerald-200/60",
        textColor: "text-emerald-800",
        iconColor: "text-emerald-600",
      };
    }
    return {
      bgColor: "bg-white/80 border-gray-200",
      textColor: "text-gray-800",
      iconColor: "text-gray-600",
    };
  };

  const status = getCompletionStatus();

  return (
    <>
      <div
        class={`group backdrop-blur-sm border rounded-lg lg:rounded-xl hover:shadow-xl transition-all duration-500 ${status.bgColor}`}
      >
        <div class="flex items-center justify-between p-4 lg:p-6">
          <div class="flex items-start space-x-3 lg:space-x-4 flex-1 min-w-0">
            {/* Checkbox */}
            <div
              class="flex items-center space-x-2 pt-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div class="relative">
                <input
                  type="checkbox"
                  checked={props.todo.completed}
                  onChange={handleToggleComplete}
                  class="sr-only"
                />
                <div
                  class={`w-5 h-5 lg:w-6 lg:h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 touch-manipulation ${
                    props.todo.completed
                      ? "bg-gradient-to-r from-emerald-400 to-green-400 border-emerald-400"
                      : "border-gray-300 hover:border-emerald-400 bg-white"
                  }`}
                  onClick={handleToggleComplete}
                >
                  {props.todo.completed && (
                    <svg
                      class="w-3 h-3 lg:w-4 lg:h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Task Content */}
            <div
              class="flex-1 cursor-pointer min-w-0"
              onClick={handleToggleExpanded}
            >
              <div class="space-y-2">
                <span
                  class={`font-medium text-base lg:text-lg transition-all duration-300 block ${
                    props.todo.completed
                      ? "line-through text-gray-500"
                      : status.textColor
                  }`}
                >
                  {props.todo.text}
                </span>

                {/* Status indicators - Stack on mobile */}
                {(props.todo.vendor_name || props.todo.cost) && (
                  <div class="flex flex-wrap gap-2">
                    {props.todo.vendor_name && (
                      <div class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
                        <svg
                          class="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span class="truncate max-w-20 lg:max-w-none">
                          {props.todo.vendor_name}
                        </span>
                      </div>
                    )}
                    {props.todo.cost && (
                      <div class="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                        <svg
                          class="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        {getTodoCostDisplay(props.todo)}
                      </div>
                    )}
                    {todoFormData().payment_status && (
                      <div
                        class={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          getPaymentStatusStyle(
                            (todoFormData().payment_status as PaymentStatus) ||
                              "not_paid"
                          ).containerClass
                        }`}
                      >
                        <svg
                          class="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span class="truncate">
                          {todoFormData()
                            .payment_status?.replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div class="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
            <Show when={props.todo.completed && props.todo.completion_date}>
              <div class="text-xs text-gray-500 font-light mr-2 hidden sm:block">
                Completed {formatCompactDate(props.todo.completion_date!)}
              </div>
            </Show>

            {/* Expand/Collapse Button */}
            <button
              type="button"
              onClick={handleToggleExpanded}
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 min-h-[44px] min-w-[44px] touch-manipulation"
              title={props.isExpanded ? "Collapse details" : "Expand details"}
            >
              <svg
                class={`w-5 h-5 transition-transform duration-300 ${
                  props.isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={handleDelete}
              class="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 min-h-[44px] min-w-[44px] touch-manipulation"
              title="Delete task"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Expandable Details Section */}
        <div
          class={`overflow-hidden transition-all duration-500 ease-in-out ${
            props.isExpanded
              ? "max-h-[2000px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div
            ref={formContainerRef}
            class="border-t border-gray-200/60 bg-gradient-to-br from-gray-50/30 to-white/60 backdrop-blur-sm"
          >
            <div class="p-4 lg:p-8 space-y-6 lg:space-y-8">
              {/* Pinterest Inspiration Section */}
              <div class="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 rounded-lg lg:rounded-xl p-4 lg:p-6 border border-pink-200/50">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center">
                      <svg
                        class="w-5 h-5 lg:w-6 lg:h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.81-2.425.853 0 1.265.641 1.265 1.408 0 .858-.546 2.141-.828 3.329-.236.996.499 1.807 1.481 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.334.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.967-.527-2.292-1.155l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-base lg:text-lg font-medium text-gray-900">
                        Get Inspiration
                      </h4>
                      <p class="text-sm text-gray-600 font-light">
                        Find beautiful ideas for "{props.todo.text}"
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetInspiration}
                    class="w-full sm:w-auto px-4 py-3 lg:px-6 lg:py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg lg:rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 min-h-[44px] touch-manipulation"
                  >
                    Browse Ideas
                  </button>
                </div>
              </div>

              {/* Form Sections - Stack on mobile */}
              <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                {/* Cost Section */}
                <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg lg:rounded-xl p-4 lg:p-6 border border-emerald-200/50">
                  <div class="flex items-center space-x-3 mb-4">
                    <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-400 to-green-400 rounded-lg flex items-center justify-center">
                      <svg
                        class="w-4 h-4 lg:w-5 lg:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-base lg:text-lg font-medium text-gray-900">
                        Budget & Costs
                      </h4>
                      <p class="text-sm text-gray-600 font-light">
                        Track expenses and payments
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Cost
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500">$</span>
                        </div>
                        <input
                          ref={firstInputRef}
                          type="number"
                          min="0"
                          value={todoFormData().cost || ""}
                          onInput={(e) =>
                            updateFormField(
                              "cost",
                              parseFloat(
                                (e.target as HTMLInputElement).value
                              ) || undefined
                            )
                          }
                          onBlur={handleInputBlur}
                          class="w-full pl-8 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all duration-300 font-light text-mobile-readable"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Payment Status
                      </label>
                      <div class="relative">
                        <select
                          value={todoFormData().payment_status || ""}
                          onChange={(e) =>
                            updateFormField(
                              "payment_status",
                              (e.target as HTMLSelectElement).value
                            )
                          }
                          onBlur={handleInputBlur}
                          class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all duration-300 font-light appearance-none cursor-pointer pr-10 text-mobile-readable"
                        >
                          <option value="">Select status</option>
                          <option value="not_paid">Not Paid</option>
                          <option value="deposit_paid">Deposit Paid</option>
                          <option value="partial_paid">Partial Payment</option>
                          <option value="fully_paid">Fully Paid</option>
                        </select>
                        {/* Custom dropdown arrow */}
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            class="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={todoFormData().due_date || ""}
                        onInput={(e) =>
                          updateFormField(
                            "due_date",
                            (e.target as HTMLInputElement).value
                          )
                        }
                        onBlur={handleInputBlur}
                        class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all duration-300 font-light text-mobile-readable"
                      />
                    </div>
                  </div>
                </div>

                {/* Vendor Section */}
                <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg lg:rounded-xl p-4 lg:p-6 border border-blue-200/50">
                  <div class="flex items-center space-x-3 mb-4">
                    <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                      <svg
                        class="w-4 h-4 lg:w-5 lg:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-base lg:text-lg font-medium text-gray-900">
                        Vendor Information
                      </h4>
                      <p class="text-sm text-gray-600 font-light">
                        Contact details
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Vendor Name
                      </label>
                      <input
                        type="text"
                        value={todoFormData().vendor_name || ""}
                        onInput={(e) =>
                          updateFormField(
                            "vendor_name",
                            (e.target as HTMLInputElement).value
                          )
                        }
                        onBlur={handleInputBlur}
                        class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 font-light text-mobile-readable"
                        placeholder="Vendor name"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={todoFormData().vendor_phone || ""}
                        onInput={(e) =>
                          updateFormField(
                            "vendor_phone",
                            (e.target as HTMLInputElement).value
                          )
                        }
                        onBlur={handlePhoneBlur}
                        class={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 font-light text-mobile-readable ${
                          !isValidVendorPhone()
                            ? "border-red-300 ring-2 ring-red-100"
                            : "border-blue-200"
                        }`}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={todoFormData().vendor_email || ""}
                        onInput={(e) =>
                          updateFormField(
                            "vendor_email",
                            (e.target as HTMLInputElement).value
                          )
                        }
                        onBlur={handleInputBlur}
                        class={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 font-light text-mobile-readable ${
                          !isValidVendorEmail()
                            ? "border-red-300 ring-2 ring-red-100"
                            : "border-blue-200"
                        }`}
                        placeholder="vendor@example.com"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        value={todoFormData().vendor_contact || ""}
                        onInput={(e) =>
                          updateFormField(
                            "vendor_contact",
                            (e.target as HTMLInputElement).value
                          )
                        }
                        onBlur={handleInputBlur}
                        class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 font-light text-mobile-readable"
                        placeholder="Contact person name"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg lg:rounded-xl p-4 lg:p-6 border border-purple-200/50">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-400 to-violet-400 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-4 h-4 lg:w-5 lg:h-5 text-white"
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
                  </div>
                  <div>
                    <h4 class="text-base lg:text-lg font-medium text-gray-900">
                      Additional Notes
                    </h4>
                    <p class="text-sm text-gray-600 font-light">
                      Details and inspirations
                    </p>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Notes & Details
                  </label>
                  <textarea
                    value={todoFormData().notes || ""}
                    onInput={(e) =>
                      updateFormField(
                        "notes",
                        (e.target as HTMLTextAreaElement).value
                      )
                    }
                    onBlur={handleInputBlur}
                    class="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 font-light text-mobile-readable"
                    rows="4"
                    placeholder="Any additional details, preferences, or inspiration notes..."
                  ></textarea>
                </div>
              </div>

              {/* Save Status indicator */}
              <div class="text-center">
                <div class="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 lg:px-6 py-2 lg:py-3 border border-gray-100 shadow-sm">
                  <Show
                    when={hasUnsavedChanges()}
                    fallback={
                      <>
                        <div class="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span class="text-sm text-gray-600 font-light">
                          All changes saved
                        </span>
                      </>
                    }
                  >
                    <div class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span class="text-sm text-amber-600 font-medium">
                      Tap outside to save
                    </span>
                  </Show>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pinterest Inspirations Modal */}
      <Show when={showInspirations()}>
        <PinterestInspirations
          searchQuery={props.todo.text}
          onClose={handleCloseInspirations}
          onSelectInspiration={handleInspirationSelect}
        />
      </Show>
    </>
  );
};

export default TodoItem;
