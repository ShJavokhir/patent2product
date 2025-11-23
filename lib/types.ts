export enum LoadingState {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export interface Patent {
    id: string;
    title: string;
    patentNumber: string;
    summary: string;
    productIdea: string;
    viabilityScore: number;
    tags: string[];
}

export interface NavItem {
    label: string;
    path: string;
}
