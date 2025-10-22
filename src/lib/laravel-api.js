import axios from 'axios';

/**
 * HTTP client for interacting with Laravel API
 */
class LaravelAPIClient {
  constructor(baseURL, apiToken) {
    this.baseURL = baseURL;
    this.apiToken = apiToken;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Execute GET request to Laravel API
   * @param {string} endpoint - API endpoint (e.g., '/out/links/list')
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Response from API
   */
  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, {
        params: {
          api_token: this.apiToken,
          ...params,
        },
      });
      
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Execute POST request to Laravel API
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Data to send
   * @returns {Promise<Object>} Response from API
   */
  async post(endpoint, data = {}) {
    try {
      const response = await this.client.post(endpoint, {
        api_token: this.apiToken,
        ...data,
      });
      
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Error handling
   * @param {Error} error - Error from axios
   * @returns {Object} Standardized error response
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        success: false,
        error: error.response.data?.message || error.response.data || 'API Error',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request was sent but no response received
      return {
        success: false,
        error: 'No response from server',
        status: 0,
      };
    } else {
      // Error during request setup
      return {
        success: false,
        error: error.message || 'Request error',
        status: 0,
      };
    }
  }
}

export default LaravelAPIClient;

