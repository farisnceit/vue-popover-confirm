<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useConfirm, useConfirmDialog } from "./composables";

const {
  ask,
  danger,
  success,
  warning,
  setGlobalConfig,
  updateMessage,
  setLoading,
} = useConfirm();
const dialog = useConfirmDialog();

// Set global configuration
onMounted(() => {
  setGlobalConfig({
    animation: "fade",
    theme: "default",
    closeOnClickOutside: true,
    closeOnEscape: true,
  });
});

const deleteItem = async () => {
  console.log("Item deleted!");
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

const handleCancel = () => {
  console.log("Delete cancelled");
};

const customOptions = {
  title: "Delete Item",
  message:
    "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText: "Delete",
  cancelText: "Keep",
  theme: "danger" as const,
  icon: "🗑️",
  onConfirm: deleteItem,
  onCancel: handleCancel,
};

const items = ref(["Item 1", "Item 2", "Item 3"]);

const removeItem = (index: number) => {
  items.value.splice(index, 1);
};

// Composable examples
const handleComposableExample = async () => {
  try {
    const confirmed = await ask("Do you want to continue?");
    console.log("User confirmed:", confirmed);
  } catch (error) {
    console.error("Error:", error);
  }
};

const handleDangerExample = async () => {
  const confirmed = await danger("This will permanently delete all data!");
  if (confirmed) {
    console.log("Dangerous action confirmed");
  }
};

const handleSuccessExample = async () => {
  const confirmed = await success(
    "Operation completed successfully! Continue?"
  );
  if (confirmed) {
    console.log("Success action confirmed");
  }
};

const handleWarningExample = async () => {
  const confirmed = await warning(
    "This action may have side effects. Proceed?"
  );
  if (confirmed) {
    console.log("Warning action confirmed");
  }
};

const handleDialogExample = async () => {
  try {
    const result = await dialog.danger({
      title: "Confirm Deletion",
      message: "This will permanently delete the selected items.",
      confirmText: "Delete All",
      cancelText: "Cancel",
      icon: "⚠️",
      animation: "scale",
      size: "large",
    });

    console.log("Dialog result:", result);
  } catch (error) {
    console.error("Dialog error:", error);
  }
};

const handleLoadingExample = async () => {
  try {
    const result = await dialog.create({
      title: "Processing",
      message: "Please wait while we process your request...",
      confirmText: "Process",
      cancelText: "Cancel",
      theme: "default",
      onConfirm: async () => {
        setLoading(true);
        updateMessage("Processing... Please wait.");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        updateMessage("Almost done...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
    });

    console.log("Loading example result:", result);
  } catch (error) {
    console.error("Loading example error:", error);
  }
};
</script>

<template>
  <div class="demo">
    <h1>Vue Popover Confirm Demo</h1>

    <div class="section">
      <h2>Basic Usage</h2>
      <p>Click any button to see the confirmation popover:</p>

      <div class="button-group">
        <button v-confirm="'Are you sure?'" class="btn btn--danger">
          Simple Confirm
        </button>

        <button v-confirm="customOptions" class="btn btn--danger">
          Advanced Confirm
        </button>
      </div>
    </div>

    <div class="section">
      <h2>Theme Variations</h2>
      <p>Different themes for different contexts:</p>

      <div class="button-group">
        <button
          v-confirm="{
            message: 'Default theme confirmation',
            theme: 'default',
          }"
          class="btn btn--primary"
        >
          Default Theme
        </button>

        <button
          v-confirm="{
            title: 'Delete Item',
            message: 'This action cannot be undone!',
            theme: 'danger',
            icon: '⚠️',
            confirmText: 'Delete',
            cancelText: 'Cancel',
          }"
          class="btn btn--danger"
        >
          Danger Theme
        </button>

        <button
          v-confirm="{
            title: 'Success!',
            message: 'Operation completed successfully!',
            theme: 'success',
            icon: '✅',
            confirmText: 'Continue',
            cancelText: 'Close',
          }"
          class="btn btn--success"
        >
          Success Theme
        </button>

        <button
          v-confirm="{
            title: 'Warning',
            message: 'This may have side effects.',
            theme: 'warning',
            icon: '⚠️',
            confirmText: 'Proceed',
            cancelText: 'Cancel',
          }"
          class="btn btn--warning"
        >
          Warning Theme
        </button>

        <button
          v-confirm="{ message: 'Dark theme confirmation', theme: 'dark' }"
          class="btn btn--dark"
        >
          Dark Theme
        </button>

        <button
          v-confirm="{
            message: 'Minimal theme confirmation',
            theme: 'minimal',
          }"
          class="btn btn--minimal"
        >
          Minimal Theme
        </button>
      </div>
    </div>

    <div class="section">
      <h2>Size Variations</h2>
      <p>Different sizes for different use cases:</p>

      <div class="button-group">
        <button
          v-confirm="{ message: 'Small popover', size: 'small' }"
          class="btn btn--primary btn--small"
        >
          Small Size
        </button>

        <button
          v-confirm="{ message: 'Medium popover (default)', size: 'medium' }"
          class="btn btn--primary"
        >
          Medium Size
        </button>

        <button
          v-confirm="{
            title: 'Large Confirmation',
            message:
              'This is a large popover with more space for content and better visibility.',
            size: 'large',
            icon: '📋',
          }"
          class="btn btn--primary btn--large"
        >
          Large Size
        </button>
      </div>
    </div>

    <div class="section">
      <h2>Animation Types</h2>
      <p>Different entrance animations:</p>

      <div class="button-group">
        <button
          v-confirm="{ message: 'Fade animation', animation: 'fade' }"
          class="btn btn--primary"
        >
          Fade
        </button>

        <button
          v-confirm="{ message: 'Scale animation', animation: 'scale' }"
          class="btn btn--primary"
        >
          Scale
        </button>

        <button
          v-confirm="{ message: 'Slide animation', animation: 'slide' }"
          class="btn btn--primary"
        >
          Slide
        </button>

        <button
          v-confirm="{ message: 'No animation', animation: 'none' }"
          class="btn btn--primary"
        >
          None
        </button>
      </div>
    </div>

    <div class="section">
      <h2>Composable API Examples</h2>
      <p>Using the composable API for programmatic control:</p>

      <div class="button-group">
        <button @click="handleComposableExample" class="btn btn--primary">
          Ask Confirmation
        </button>

        <button @click="handleDangerExample" class="btn btn--danger">
          Danger Confirmation
        </button>

        <button @click="handleSuccessExample" class="btn btn--success">
          Success Confirmation
        </button>

        <button @click="handleWarningExample" class="btn btn--warning">
          Warning Confirmation
        </button>

        <button @click="handleDialogExample" class="btn btn--primary">
          Custom Dialog
        </button>

        <button
          @click="handleLoadingExample"
          class="btn btn--primary loading-example"
        >
          Loading Example
        </button>
      </div>
    </div>

    <div class="section">
      <h2>Advanced Features</h2>
      <p>Advanced configuration options:</p>

      <div class="button-group">
        <button
          v-confirm="{
            message: 'This popover has a close button',
            showCloseButton: true,
            closeOnClickOutside: false,
          }"
          class="btn btn--primary"
        >
          With Close Button
        </button>

        <button
          v-confirm="{
            message: 'This popover cannot be closed by clicking outside',
            closeOnClickOutside: false,
            closeOnEscape: false,
            persistent: true,
          }"
          class="btn btn--primary"
        >
          Persistent
        </button>

        <button
          v-confirm="{
            message: 'This popover will auto-close in 3 seconds',
            timeout: 3000,
          }"
          class="btn btn--primary"
        >
          Auto Close
        </button>

        <button
          v-confirm="{
            message: 'Focus will be on cancel button',
            autoFocus: 'cancel',
          }"
          class="btn btn--primary"
        >
          Focus Cancel
        </button>

        <button
          v-confirm="{
            message: 'No auto focus',
            autoFocus: 'none',
          }"
          class="btn btn--primary"
        >
          No Auto Focus
        </button>
      </div>
    </div>

    <div class="section">
      <h2>Dynamic List Example</h2>
      <p>Try deleting items from the list:</p>

      <div class="list">
        <div v-for="(item, index) in items" :key="item" class="list-item">
          <span>{{ item }}</span>
          <button
            v-confirm="{
              title: 'Delete Item',
              message: `Delete ${item}?`,
              theme: 'danger',
              confirmText: 'Delete',
              cancelText: 'Cancel',
              icon: '🗑️',
              onConfirm: () => removeItem(index),
            }"
            class="btn btn--small btn--danger"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Positioning Tests</h2>
      <p>Test popover positioning near screen edges:</p>

      <div class="edge-tests">
        <button
          v-confirm="{ message: 'Top edge test', placement: 'bottom' }"
          class="btn btn--primary edge-btn edge-btn--top"
        >
          Top Edge
        </button>

        <button
          v-confirm="{ message: 'Right edge test', placement: 'left' }"
          class="btn btn--primary edge-btn edge-btn--right"
        >
          Right Edge
        </button>

        <button
          v-confirm="{ message: 'Bottom edge test', placement: 'top' }"
          class="btn btn--primary edge-btn edge-btn--bottom"
        >
          Bottom Edge
        </button>

        <button
          v-confirm="{ message: 'Left edge test', placement: 'right' }"
          class="btn btn--primary edge-btn edge-btn--left"
        >
          Left Edge
        </button>
      </div>
    </div>

    <!-- The confirm root component will be auto-mounted -->
    <VuePopoverConfirmRoot />
  </div>
</template>

<style scoped>
.demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

.section {
  margin-bottom: 3rem;
}

.section h2 {
  color: #374151;
  margin-bottom: 0.5rem;
}

.section p {
  color: #6b7280;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn--primary {
  background: #3b82f6;
  color: white;
}

.btn--primary:hover {
  background: #2563eb;
}

.btn--danger {
  background: #ef4444;
  color: white;
}

.btn--danger:hover {
  background: #dc2626;
}

.btn--success {
  background: #16a34a;
  color: white;
}

.btn--success:hover {
  background: #15803d;
}

.btn--warning {
  background: #f59e0b;
  color: white;
}

.btn--warning:hover {
  background: #d97706;
}

.btn--dark {
  background: #1f2937;
  color: white;
}

.btn--dark:hover {
  background: #111827;
}

.btn--minimal {
  background: #ffffff;
  color: #000000;
  border: 1px solid #e5e7eb;
}

.btn--minimal:hover {
  background: #f9fafb;
}

.btn--large {
  padding: 1rem 2rem;
  font-size: 16px;
}

.btn--small {
  padding: 0.5rem 0.75rem;
  font-size: 12px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.edge-tests {
  position: relative;
  height: 300px;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
}

.edge-btn {
  position: absolute;
}

.edge-btn--top {
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.edge-btn--right {
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

.edge-btn--bottom {
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.edge-btn--left {
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}
</style>
