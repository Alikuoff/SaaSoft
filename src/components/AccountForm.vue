<template>
  <div class="account-form">
    <!-- Header -->
    <div class="form-header">
      <div class="title-section">
        <h1 class="title gradient-text">Учетные записи</h1>
        <p class="subtitle">Управление пользователями системы</p>
      </div>
      <el-button 
        type="primary" 
        :icon="Plus" 
        circle
        size="large"
        @click="handleAddAccount"
  class="add-button"
      />
    </div>

    <!-- Help text -->
    <div class="help-text">
      <el-icon class="help-icon"><QuestionFilled /></el-icon>
      <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
    </div>

    <!-- Accounts list -->
    <div class="accounts-container" v-if="accountStore.accountsCount > 0">
      <div class="table-headers">
        <div class="header-label">
          <el-icon><PriceTag /></el-icon>
          Метки
        </div>
        <div class="header-type">
          <el-icon><Setting /></el-icon>
          Тип записи
        </div>
        <div class="header-login">
          <el-icon><User /></el-icon>
          Логин
        </div>
        <div class="header-password">
          <el-icon><Lock /></el-icon>
          Пароль
        </div>
        <div class="header-actions"></div>
      </div>

      <TransitionGroup name="account" tag="div" class="accounts-list">
        <AccountItem
          v-for="account in accountStore.accounts"
          :key="account.id"
          :account="account"
          @update="handleUpdateAccount"
          @delete="handleDeleteAccount"
        />
      </TransitionGroup>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <el-empty description="Нет учетных записей">
        <el-button type="primary" @click="handleAddAccount">
          Добавить первую запись
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, QuestionFilled, PriceTag, Setting, User, Lock } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAccountStore } from '@/stores/accountStore';
import AccountItem from './AccountItem.vue';
import type { Account } from '@/types/account';

const accountStore = useAccountStore();

const handleAddAccount = () => {
  // Create a temporary account object for validation
  const tempAccount = {
    id: Date.now().toString(),
    label: '',
    tags: [],
    type: 'Локальная',
    login: '',
    password: '',
    errors: {}
  };

  // If there are existing accounts, check the last one for completeness
  if (accountStore.accounts.length > 0) {
    const last = accountStore.accounts[accountStore.accounts.length - 1];
    // Validate last account
    if (!accountStore.validateAccount(last)) {
      ElMessage.warning('Пожалуйста, заполните все обязательные поля перед добавлением новой записи.');
      return;
    }
  }

  // Add new account
  accountStore.addAccount();
  ElMessage.success('Новая учетная запись добавлена');
};

const handleUpdateAccount = (id: string, updates: Partial<Account>) => {
  accountStore.updateAccount(id, updates);
};

const handleDeleteAccount = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      'Вы уверены, что хотите удалить эту учетную запись?',
      'Подтверждение удаления',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
      }
    );
    
    accountStore.removeAccount(id);
    ElMessage.success('Учетная запись удалена');
  } catch {
    // User cancelled
  }
};
</script>

<style scoped>
.account-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.account-form:hover {
  box-shadow: var(--card-shadow-hover);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
  position: relative;
}

.form-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: var(--primary-gradient);
  border-radius: 2px;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  margin: 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 16px;
  color: #909399;
  margin: 0;
  font-weight: 400;
}


.add-button {
  width: 56px;
  height: 56px;
  background: var(--primary-gradient);
  border: none;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}


.add-button:hover {
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.help-text {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  margin-bottom: 32px;
  color: #606266;
  font-size: 14px;
  backdrop-filter: blur(10px);
}

.help-icon {
  color: #667eea;
  font-size: 18px;
}

.accounts-container {
  background: rgba(250, 250, 250, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.table-headers {
  display: grid;
  grid-template-columns: 1fr 140px 180px 180px 80px;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.05) 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  font-weight: 700;
  color: #606266;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-headers > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-headers .el-icon {
  font-size: 16px;
  color: #667eea;
}

.accounts-list {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state :deep(.el-empty__image) {
  width: 120px;
}

.empty-state :deep(.el-button) {
  background: var(--primary-gradient);
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.empty-state :deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

/* Responsive design */
@media (max-width: 768px) {
  .account-form {
    padding: 20px;
    margin: 16px;
    border-radius: 20px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  .table-headers {
    display: none;
  }
  
  .help-text {
    font-size: 13px;
    padding: 14px 16px;
  }
}

/* Animations */
.account-enter-active,
.account-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.account-enter-from {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

.account-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.account-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>