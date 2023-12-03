import axios from 'axios';

const axiosInstance = axios.create({
    headers: {
        'x-garage-app': 'foo to the bar'
    },
});

export default axiosInstance;