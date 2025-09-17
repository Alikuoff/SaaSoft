import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Account, Tag } from '@/types/account';

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);

  // Load from localStorage on store creation
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('accounts');
      if (stored) {
        accounts.value = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading accounts from localStorage:', error);
    }
  };

  // Save to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem('accounts', JSON.stringify(accounts.value));
    } catch (error) {
      console.error('Error saving accounts to localStorage:', error);
    }
  };

  const addAccount = () => {
    const newAccount: Account = {
      id: Date.now().toString(),
      label: '',
      tags: [],
      type: 'Локальная',
      login: '',
      password: '',
      errors: {}
    };
    accounts.value.push(newAccount);
    saveToStorage();
  };

  const removeAccount = (id: string) => {
    const index = accounts.value.findIndex(account => account.id === id);
    if (index !== -1) {
      accounts.value.splice(index, 1);
      saveToStorage();
    }
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    const account = accounts.value.find(acc => acc.id === id);
    if (account) {
      Object.assign(account, updates);
      saveToStorage();
    }
  };

  const parseLabel = (label: string): Tag[] => {
    if (!label.trim()) return [];
    return label
      .split(';')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => ({ text: tag }));
  };

  const validateAccount = (account: Account): boolean => {
    const errors: Account['errors'] = {};
    
    if (!account.login.trim()) {
      errors.login = 'Логин обязателен для заполнения';
    } else if (account.login.length > 100) {
      errors.login = 'Логин не должен превышать 100 символов';
    }

    if (account.type === 'Локальная') {
      if (!account.password?.trim()) {
        errors.password = 'Пароль обязателен для заполнения';
      } else if (account.password && account.password.length > 100) {
        errors.password = 'Пароль не должен превышать 100 символов';
      }
    }

    account.errors = errors;
    saveToStorage();
    
    return Object.keys(errors).length === 0;
  };

  const accountsCount = computed(() => accounts.value.length);

  // Initialize store
  loadFromStorage();

  return {
    accounts,
    accountsCount,
    addAccount,
    removeAccount,
    updateAccount,
    parseLabel,
    validateAccount
  };
});