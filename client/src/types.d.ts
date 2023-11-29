import { User } from '@auth0/auth0-react';
import { ReactNode } from 'react';

interface AppConfig {
    apiRoot: string
}

interface Environments {
    production: AppConfig
    development: AppConfig
}

export interface RTAapp {
    apiRoot?: string
}
export interface RTAComponent extends RTAapp {
    isLoading?: boolean
    isAuthenticated?: boolean
    isMobile?: boolean
    user?: User
    children?: ReactNode
    authState?: any
    setAuthState?: any
}

export interface RTARoutableComponent extends RTAComponent {
    currentRoute: string
    nextRoute: string
}

type ColorScheme = {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    disabled: string;
};





