export interface Tag {
  text: string;
}

export interface Account {
  id: string;
  label: string;
  tags: Tag[];
  type: 'LDAP' | 'Локальная';
  login: string;
  password: string | null;
  errors: {
    login?: string;
    password?: string;
  };
}

export type AccountType = 'LDAP' | 'Локальная';