export enum AppStage {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

const AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL,
  stage: import.meta.env.VITE_STAGE?.toUpperCase(),
};

export default AppConfig;
