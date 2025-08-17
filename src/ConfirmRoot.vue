<template>
  <Teleport to="body">
    <Transition :name="`vpc-${confirmManager.state.animation}`" appear>
      <div
        v-if="confirmManager.state.isVisible"
        ref="popoverRef"
        class="vpc"
        :class="[
          `vpc--theme-${confirmManager.state.theme}`,
          `vpc--size-${confirmManager.state.size}`,
          confirmManager.state.customClass,
          {
            'vpc--loading': confirmManager.state.loading,
            'vpc--disabled': confirmManager.state.disabled,
            'vpc--with-title': confirmManager.state.title,
            'vpc--with-icon': confirmManager.state.icon,
            'vpc--with-close': confirmManager.state.showCloseButton,
          },
        ]"
        :style="{
          zIndex: confirmManager.state.zIndex,
          maxWidth: `${confirmManager.state.maxWidth}px`,
          minWidth: `${confirmManager.state.minWidth}px`,
        }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="confirmManager.state.title ? 'vpc-title' : undefined"
        :aria-describedby="'vpc-message'"
        @keydown="handleKeydown"
      >
        <!-- Close button -->
        <button
          v-if="confirmManager.state.showCloseButton"
          ref="closeButtonRef"
          type="button"
          class="vpc__close"
          aria-label="Close"
          @click="handleCancel"
        >
          ×
        </button>

        <!-- Loading overlay -->
        <div v-if="confirmManager.state.loading" class="vpc__loading-overlay">
          <div class="vpc__spinner"></div>
        </div>

        <!-- Icon -->
        <div v-if="confirmManager.state.icon" class="vpc__icon">
          <span v-if="typeof confirmManager.state.icon === 'string'">
            {{ confirmManager.state.icon }}
          </span>
          <svg
            v-else
            class="vpc__icon-default"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9,12l2,2 4,-4" />
          </svg>
        </div>

        <!-- Title -->
        <div
          v-if="confirmManager.state.title"
          id="vpc-title"
          class="vpc__title"
        >
          {{ confirmManager.state.title }}
        </div>

        <!-- Message -->
        <div
          id="vpc-message"
          class="vpc__message"
          :class="{ 'vpc__message--html': confirmManager.state.html }"
        >
          <span
            v-if="confirmManager.state.html"
            v-html="confirmManager.state.message"
          ></span>
          <span v-else>{{ confirmManager.state.message }}</span>
        </div>

        <!-- Actions -->
        <div class="vpc__actions">
          <button
            ref="cancelButtonRef"
            type="button"
            class="vpc__button vpc__button--cancel"
            :disabled="confirmManager.state.disabled"
            @click="handleCancel"
          >
            <span class="vpc__button-text">{{
              confirmManager.state.cancelText
            }}</span>
          </button>
          <button
            ref="confirmButtonRef"
            type="button"
            class="vpc__button vpc__button--confirm"
            :disabled="confirmManager.state.disabled"
            @click="handleConfirm"
          >
            <span
              v-if="confirmManager.state.loading"
              class="vpc__button-spinner"
            ></span>
            <span class="vpc__button-text">{{
              confirmManager.state.confirmText
            }}</span>
          </button>
        </div>

        <!-- Arrow -->
        <div ref="arrowRef" class="vpc__arrow" :class="arrowClass"></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted } from "vue";
import {
  computePosition,
  flip,
  offset,
  shift,
  arrow,
  autoUpdate,
} from "@floating-ui/dom";
import { confirmManager } from "./manager";

const popoverRef = ref<HTMLElement>();
const arrowRef = ref<HTMLElement>();
const confirmButtonRef = ref<HTMLElement>();
const cancelButtonRef = ref<HTMLElement>();
const closeButtonRef = ref<HTMLElement>();
const arrowClass = ref("vpc__arrow--top");

let cleanup: (() => void) | null = null;
let autoUpdateCleanup: (() => void) | undefined = undefined;

const updatePosition = async () => {
  if (
    !popoverRef.value ||
    !arrowRef.value ||
    !confirmManager.state.targetElement
  ) {
    return;
  }

  const { x, y, placement, middlewareData } = await computePosition(
    confirmManager.state.targetElement,
    popoverRef.value,
    {
      placement: confirmManager.state.placement,
      middleware: [
        offset(confirmManager.state.offset),
        flip(),
        shift({ padding: 8 }),
        arrow({ element: arrowRef.value }),
      ],
    }
  );

  Object.assign(popoverRef.value.style, {
    left: `${x}px`,
    top: `${y}px`,
  });

  // Position arrow
  if (middlewareData.arrow) {
    const { x: arrowX, y: arrowY } = middlewareData.arrow;
    const staticSide = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    }[placement.split("-")[0]]!;

    Object.assign(arrowRef.value.style, {
      left: arrowX != null ? `${arrowX}px` : "",
      top: arrowY != null ? `${arrowY}px` : "",
      right: "",
      bottom: "",
      [staticSide]: "-4px",
    });

    // Update arrow class based on placement
    const side = placement.split("-")[0];
    arrowClass.value = `vpc__arrow--${side}`;
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    !confirmManager.state.closeOnClickOutside ||
    confirmManager.state.persistent
  ) {
    return;
  }

  if (
    !popoverRef.value?.contains(event.target as Node) &&
    !confirmManager.state.targetElement?.contains(event.target as Node)
  ) {
    confirmManager.cancel();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (
    event.key === "Escape" &&
    confirmManager.state.closeOnEscape &&
    !confirmManager.state.persistent
  ) {
    confirmManager.cancel();
    return;
  }

  // Handle Enter key
  if (event.key === "Enter" && !confirmManager.state.disabled) {
    confirmManager.confirm();
    return;
  }

  // Focus trap
  if (event.key === "Tab") {
    const focusableElements = [
      closeButtonRef.value,
      cancelButtonRef.value,
      confirmButtonRef.value,
    ].filter(Boolean);

    const currentIndex = focusableElements.indexOf(
      document.activeElement as HTMLElement
    );

    if (event.shiftKey) {
      const prevIndex =
        currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
      focusableElements[prevIndex]?.focus();
    } else {
      const nextIndex =
        currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
      focusableElements[nextIndex]?.focus();
    }

    event.preventDefault();
  }
};

const handleConfirm = () => {
  confirmManager.confirm();
};

const handleCancel = () => {
  confirmManager.cancel();
};

watch(
  () => confirmManager.state.isVisible,
  async (isVisible) => {
    if (isVisible) {
      await nextTick();
      await updatePosition();

      // Set up auto-update for position
      if (confirmManager.state.targetElement && popoverRef.value) {
        autoUpdateCleanup = autoUpdate(
          confirmManager.state.targetElement,
          popoverRef.value,
          updatePosition
        );
      }

      // Focus management
      await nextTick();
      const autoFocus = confirmManager.state.autoFocus;
      if (autoFocus === "confirm") {
        confirmButtonRef.value?.focus();
      } else if (autoFocus === "cancel") {
        cancelButtonRef.value?.focus();
      }

      // Add event listeners
      if (confirmManager.state.closeOnClickOutside) {
        document.addEventListener("click", handleClickOutside, true);
      }
    } else {
      // Clean up auto-update
      if (autoUpdateCleanup) {
        autoUpdateCleanup();
        autoUpdateCleanup = undefined;
      }

      // Remove event listeners
      document.removeEventListener("click", handleClickOutside, true);
    }
  }
);

onMounted(() => {
  if (confirmManager.state.isVisible) {
    updatePosition();
  }
});

onUnmounted(() => {
  if (cleanup) {
    cleanup();
  }
  if (autoUpdateCleanup) {
    autoUpdateCleanup();
  }
});
</script>
