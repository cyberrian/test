const {env} = process;

export const nodeEnv = env.NODE_ENV || 'development';

export default {
    port: env.PORT || 8080
};
