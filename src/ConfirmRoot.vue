<template>
  <Teleport to="body">
    <div
      v-if="confirmManager.state.isVisible"
      ref="popoverRef"
      class="vpc"
      role="dialog"
      aria-modal="true"
      :aria-label="confirmManager.state.message"
      @keydown="handleKeydown"
    >
      <div class="vpc__message">
        {{ confirmManager.state.message }}
      </div>
      
      <div class="vpc__actions">
        <button
          ref="cancelButtonRef"
          type="button"
          class="vpc__button vpc__button--no"
          @click="handleCancel"
        >
          {{ confirmManager.state.cancelText }}
        </button>
        <button
          ref="confirmButtonRef"
          type="button"
          class="vpc__button vpc__button--yes"
          @click="handleConfirm"
        >
          {{ confirmManager.state.confirmText }}
        </button>
      </div>

      <div
        ref="arrowRef"
        class="vpc__arrow"
        :class="arrowClass"
      ></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue';
import { computePosition, flip, offset, shift, arrow } from '@floating-ui/dom';
import { confirmManager } from './manager';

const popoverRef = ref<HTMLElement>();
const arrowRef = ref<HTMLElement>();
const confirmButtonRef = ref<HTMLElement>();
const cancelButtonRef = ref<HTMLElement>();
const arrowClass = ref('vpc__arrow--top');

const updatePosition = async () => {
  if (!popoverRef.value || !arrowRef.value || !confirmManager.state.targetElement) {
    return;
  }

  const { x, y, placement, middlewareData } = await computePosition(
    confirmManager.state.targetElement,
    popoverRef.value,
    {
      placement: 'top-start',
      middleware: [
        offset(12),
        flip(),
        shift({ padding: 8 }),
        arrow({ element: arrowRef.value })
      ]
    }
  );

  Object.assign(popoverRef.value.style, {
    left: `${x}px`,
    top: `${y}px`
  });

  // Position arrow
  const { x: arrowX, y: arrowY } = middlewareData.arrow!;
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]]!;

  Object.assign(arrowRef.value.style, {
    left: arrowX != null ? `${arrowX}px` : '',
    top: arrowY != null ? `${arrowY}px` : '',
    right: '',
    bottom: '',
    [staticSide]: '-4px',
  });

  // Update arrow class based on placement
  const side = placement.split('-')[0];
  arrowClass.value = `vpc__arrow--${side}`;
};

const handleClickOutside = (event: MouseEvent) => {
  if (!popoverRef.value?.contains(event.target as Node) &&
      !confirmManager.state.targetElement?.contains(event.target as Node)) {
    confirmManager.cancel();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    confirmManager.cancel();
    return;
  }

  // Simple focus trap
  if (event.key === 'Tab') {
    const focusableElements = [cancelButtonRef.value, confirmButtonRef.value].filter(Boolean);
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    
    if (event.shiftKey) {
      const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
      focusableElements[prevIndex]?.focus();
    } else {
      const nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
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
      
      // Focus the confirm button by default
      confirmButtonRef.value?.focus();
      
      // Add event listeners
      document.addEventListener('click', handleClickOutside, true);
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    } else {
      // Remove event listeners
      document.removeEventListener('click', handleClickOutside, true);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    }
  }
);

onMounted(() => {
  if (confirmManager.state.isVisible) {
    updatePosition();
  }
});

onUnmounted(() => {
  // Remove event listeners if component is unmounted while visible
  if (confirmManager.state.isVisible) {
    document.removeEventListener('click', handleClickOutside, true);
    window.removeEventListener('resize', updatePosition);
    window.removeEventListener('scroll', updatePosition, true);
  }
});
</script>