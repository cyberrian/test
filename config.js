const {env} = process;

export const nodeEnv = env.NODE_ENV || 'development';

export default {
    port: env.PORT || 8080,
    host: env.HOST || '0.0.0.0', // 0.0.0.0 binds to all IPv4 address on local machine
    get serverUrl() {
        return `http://${this.host}:${this.port}`;
    }
};
