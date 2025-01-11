const handleAdminError = (error) => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                // Handle unauthorized access
                break;
            case 403:
                // Handle forbidden access
                break;
            case 404:
                // Handle not found
                break;
            default:
                // Handle other errors
        }
    }
    return error;
};

module.exports = handleAdminError; 