<template>
  <div class="account-item" :class="{ 'has-errors': hasErrors, 'ldap-type': localAccount.type === 'LDAP' }">
    <!-- Labels -->
    <div class="field-group">
      <label class="field-label mobile-only">Метки</label>
      <el-input
        v-model="localAccount.label"
        placeholder="Введите метки через ;"
        maxlength="50"
        show-word-limit
        @blur="handleLabelBlur"
        class="label-input"
      />
    </div>

    <!-- Type -->
    <div class="field-group">
      <label class="field-label mobile-only">Тип записи</label>
      <el-select
        v-model="localAccount.type"
        @change="handleTypeChange"
        class="type-select"
      >
        <el-option label="Локальная" value="Локальная" />
        <el-option label="LDAP" value="LDAP" />
      </el-select>
    </div>

    <!-- Login -->
    <div class="field-group">
      <label class="field-label mobile-only">Логин</label>
      <el-input
        v-model="localAccount.login"
        placeholder="Введите логин"
        maxlength="100"
        show-word-limit
        @blur="handleLoginBlur"
        :class="{ 'error': localAccount.errors.login }"
        class="login-input"
      />
      <div v-if="localAccount.errors.login" class="error-text">
        {{ localAccount.errors.login }}
      </div>
    </div>

    <!-- Password -->
    <div class="field-group">
      <label class="field-label mobile-only">Пароль</label>
      <div v-if="localAccount.type === 'Локальная'">
        <el-input
          v-model="localAccount.password"
          type="password"
          placeholder="Введите пароль"
          maxlength="100"
          show-word-limit
          @blur="handlePasswordBlur"
          :class="{ 'error': localAccount.errors.password }"
          class="password-input"
          show-password
        />
        <div v-if="localAccount.errors.password" class="error-text">
          {{ localAccount.errors.password }}
        </div>
      </div>
      <div v-else class="ldap-password-placeholder">
        <el-icon><Lock /></el-icon>
        <span class="ldap-text">LDAP аутентификация</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="field-group actions">
      <el-button
        type="danger"
        :icon="Delete"
        circle
        @click="handleDelete"
        class="delete-button"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Delete, Lock } from '@element-plus/icons-vue';
import type { Account } from '@/types/account';
import { useAccountStore } from '@/stores/accountStore';

interface Props {
  account: Account;
}

interface Emits {
  (e: 'update', id: string, updates: Partial<Account>): void;
  (e: 'delete', id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const accountStore = useAccountStore();

const localAccount = ref<Account>({ ...props.account });

const hasErrors = computed(() => 
  Object.keys(localAccount.value.errors).length > 0
);

// Watch for external changes
watch(() => props.account, (newAccount) => {
  localAccount.value = { ...newAccount };
}, { deep: true });

const handleLabelBlur = () => {
  const tags = accountStore.parseLabel(localAccount.value.label);
  const updates = {
    label: localAccount.value.label,
    tags
  };
  emit('update', localAccount.value.id, updates);
};

const handleTypeChange = () => {
  const updates: Partial<Account> = {
    type: localAccount.value.type,
    password: localAccount.value.type === 'LDAP' ? null : '',
    errors: { ...localAccount.value.errors }
  };
  
  // Clear password error when switching to LDAP
  if (localAccount.value.type === 'LDAP') {
    delete updates.errors!.password;
  }
  
  emit('update', localAccount.value.id, updates);
  
  // Validate immediately after type change
  setTimeout(() => {
    accountStore.validateAccount(localAccount.value);
  }, 0);
};

const handleLoginBlur = () => {
  const updates = { login: localAccount.value.login };
  emit('update', localAccount.value.id, updates);
  accountStore.validateAccount(localAccount.value);
};

const handlePasswordBlur = () => {
  if (localAccount.value.type === 'Локальная') {
    const updates = { password: localAccount.value.password };
    emit('update', localAccount.value.id, updates);
    accountStore.validateAccount(localAccount.value);
  }
};

const handleDelete = () => {
  emit('delete', localAccount.value.id);
};
</script>

<style scoped>
.account-item {
  display: grid;
  grid-template-columns: 1fr 140px 180px 180px 80px;
  gap: 20px;
  padding: 24px;
  border-bottom: 1px solid rgba(235, 238, 245, 0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
}

.account-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.account-item:hover {
  background: rgba(255, 255, 255, 0.95);
}

.account-item:hover::before {
  opacity: 1;
}

.account-item.ldap-type {
  background: linear-gradient(135deg, rgba(17, 153, 142, 0.05) 0%, rgba(56, 239, 125, 0.05) 100%);
}

.account-item.ldap-type::before {
  background: var(--success-gradient);
}

.account-item.has-errors {
  background: linear-gradient(135deg, rgba(252, 70, 107, 0.05) 0%, rgba(63, 94, 251, 0.05) 100%);
}

.account-item.has-errors::before {
  background: var(--danger-gradient);
  opacity: 1;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 11px;
  font-weight: 700;
  color: #606266;
  display: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mobile-only {
  display: none;
}

.error-text {
  font-size: 11px;
  color: #fc466b;
  margin-top: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-text::before {
  content: '⚠';
  font-size: 12px;
}

.ldap-password-placeholder {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(17, 153, 142, 0.1) 0%, rgba(56, 239, 125, 0.1) 100%);
  border: 1px solid rgba(17, 153, 142, 0.2);
  border-radius: 12px;
  color: #11998e;
  font-size: 14px;
  min-height: 40px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.ldap-text {
  font-weight: 600;
}

.actions {
  align-items: center;
  justify-content: center;
}

.delete-button {
  width: 40px;
  height: 40px;
  background: var(--danger-gradient);
  border: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(252, 70, 107, 0.3);
}

.delete-button:hover {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 8px 25px rgba(252, 70, 107, 0.4);
}

/* Error state styles */
:deep(.el-input.error .el-input__wrapper) {
  border-color: #fc466b;
  box-shadow: 0 0 0 1px #fc466b inset;
  background: rgba(252, 70, 107, 0.05);
}

:deep(.el-input.error .el-input__wrapper:hover) {
  border-color: #fc466b;
}

:deep(.el-input.error .el-input__wrapper.is-focus) {
  border-color: #fc466b;
  box-shadow: 0 0 0 1px #fc466b inset;
}

/* Enhanced input styles */
:deep(.el-input__wrapper) {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

:deep(.el-input__wrapper:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 12px;
}

:deep(.el-select-dropdown) {
  border-radius: 12px;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .account-item {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 24px;
    border-radius: 20px;
    margin-bottom: 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .account-item::before {
    width: 100%;
    height: 4px;
    top: 0;
    left: 0;
  }
  
  .field-label {
    display: block !important;
  }
  
  .mobile-only {
    display: block !important;
  }
  
  .actions {
    align-items: flex-end;
    margin-top: 12px;
  }
}

/* Animations */
.field-group {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-input__wrapper) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-select) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>