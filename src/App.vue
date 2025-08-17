<script setup lang="ts">
import { ref } from 'vue';

const deleteItem = async () => {
  console.log('Item deleted!');
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 500));
};

const handleCancel = () => {
  console.log('Delete cancelled');
};

const customOptions = {
  message: 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText: 'Delete',
  cancelText: 'Keep',
  onConfirm: deleteItem,
  onCancel: handleCancel
};

const items = ref(['Item 1', 'Item 2', 'Item 3']);

const removeItem = (index: number) => {
  items.value.splice(index, 1);
};
</script>

<template>
  <div class="demo">
    <h1>Vue Popover Confirm Demo</h1>
    
    <div class="section">
      <h2>Basic Usage</h2>
      <p>Click any button to see the confirmation popover:</p>
      
      <div class="button-group">
        <button 
          v-confirm="'Are you sure?'"
          class="btn btn--danger"
        >
          Simple Confirm
        </button>
        
        <button 
          v-confirm="customOptions"
          class="btn btn--danger"
        >
          Advanced Confirm
        </button>
      </div>
    </div>

    <div class="section">
      <h2>Dynamic List Example</h2>
      <p>Try deleting items from the list:</p>
      
      <div class="list">
        <div 
          v-for="(item, index) in items" 
          :key="item"
          class="list-item"
        >
          <span>{{ item }}</span>
          <button
            v-confirm="{
              message: `Delete ${item}?`,
              confirmText: 'Delete',
              cancelText: 'Cancel',
              onConfirm: () => removeItem(index)
            }"
            class="btn btn--small btn--danger"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Edge Cases</h2>
      <p>Test popover positioning near screen edges:</p>
      
      <div class="edge-tests">
        <button 
          v-confirm="'Top edge test'"
          class="btn btn--primary edge-btn edge-btn--top"
        >
          Top Edge
        </button>
        
        <button 
          v-confirm="'Right edge test'"
          class="btn btn--primary edge-btn edge-btn--right"
        >
          Right Edge
        </button>
        
        <button 
          v-confirm="'Bottom edge test'"
          class="btn btn--primary edge-btn edge-btn--bottom"
        >
          Bottom Edge
        </button>
        
        <button 
          v-confirm="'Left edge test'"
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