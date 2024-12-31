import axios from 'axios';

const SSM_ENDPOINT = 'http://localhost:2773/systemsmanager/parameters/get';

export const getDbUsername = async (): Promise<string> => {
  try {
    const paramName = `/gpt-user-auth/${process.env.PULUMI_STACK}/DB_USERNAME`;
    const response = await axios.get(
      `${SSM_ENDPOINT}/?name=${encodeURIComponent(paramName)}&withDecryption=true`, {
      headers: {
        'X-Aws-Parameters-Secrets-Token': process.env.AWS_SESSION_TOKEN
      }
    });
    return response.data.Parameter.Value;
  } catch (error) {
    console.error('Error fetching DB username from SSM:', error);
    throw error;
  }
};

export const getDbPassword = async (): Promise<string> => {
  try {
    const paramName = `/gpt-user-auth/${process.env.PULUMI_STACK}/DB_PASSWORD`;
    const response = await axios.get(
      `${SSM_ENDPOINT}/?name=${encodeURIComponent(paramName)}&withDecryption=true`, {
      headers: {
        'X-Aws-Parameters-Secrets-Token': process.env.AWS_SESSION_TOKEN
      }
    });
    return response.data.Parameter.Value;
  } catch (error) {
    console.error('Error fetching DB password from SSM:', error);
    throw error;
  }
};

export const getJwtSecretParameterStore = async (): Promise<string> => {
  try {
    const paramName = `/gpt-user-auth/${process.env.PULUMI_STACK}/JWT_SECRET`;
    const response = await axios.get(
      `${SSM_ENDPOINT}/?name=${encodeURIComponent(paramName)}&withDecryption=true`, {
      headers: {
        'X-Aws-Parameters-Secrets-Token': process.env.AWS_SESSION_TOKEN
      }
    });
    return response.data.Parameter.Value;
  } catch (error) {
    console.error('Error fetching JWT secret from SSM:', error);
    throw error;
  }
};

export const getFirebaseCredentials = async (): Promise<string> => {
  try {
    const paramName = `/gpt-user-auth/${process.env.PULUMI_STACK}/FIREBASE_CREDENTIALS`;
    const response = await axios.get(
      `${SSM_ENDPOINT}/?name=${encodeURIComponent(paramName)}&withDecryption=true`, {
      headers: {
        'X-Aws-Parameters-Secrets-Token': process.env.AWS_SESSION_TOKEN
      }
    });
    return response.data.Parameter.Value;
  } catch (error) {
    console.error('Error fetching Firebase credentials from SSM:', error);
    throw error;
  }
};