export type Country = {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [languageCode: string]: {
        official: string;
        common: string;
      };
    };
  };

  flags: {
    png: string;
    svg: string;
    alt?: string;
  };

  cca2: string;

  region: string;

  languages?: Record<string, string>;
};

export interface Slide {
  id: string;
  image: any;
  title: string;
  subtitle: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
export type AuditResultCardProps = {
  url: string;
  status: "Passed" | "Average" | "Failed";
  score: string;
  time: string
};

export interface ResetPasswordEmailState {
  passwordRecoveryEmail: string;
  setPasswordRecoveryEmail: (email: string) => void;
  otpToken: string;
  setOtpToken: (token: string) => void;
}