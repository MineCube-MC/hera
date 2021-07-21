export interface Config {
    token: string;
    mongoURI: string;
    prefix: string;
    owners: string[];
    colors: {
        main: string;
        secondary: string;
    }
}