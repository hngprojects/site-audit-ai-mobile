import { ResetPasswordEmailState } from '@/type';
import { create } from 'zustand';



export const useResetPasswordEmailStore = create<ResetPasswordEmailState>((set) => ({
  passwordRecoveryEmail: '',
  setPasswordRecoveryEmail: (email) =>
    set({ passwordRecoveryEmail: email }),
}));
