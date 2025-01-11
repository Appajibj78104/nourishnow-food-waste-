export const checkFirstTimeLogin = (user) => {
    return user.role === 'donor' && !user.profileCompleted;
};

export const setProfileCompleted = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        user.profileCompleted = true;
        localStorage.setItem('user', JSON.stringify(user));
    }
};

// module.exports = {
//   checkFirstTimeLogin,
//     setProfileCompleted
// }; 