export interface FireData {
    latitude: number;
    longitude: number;
    city: string;
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    fireRisk?: string;
}

export interface FireListProps {
    apiUrl: string;
    filterHighRisk?: boolean;
    title?: string;
}

export interface FireMapScreenProps {
    apiUrl: string;
    filterHighRisk?: boolean;
}

export interface FireRiskData {
    latitude: number;
    longitude: number;
    city: string;
    ["Fire Risk"]?: string;
}