/**
 * She Wants - Authentication Module (Frontend Simulation)
 * Handles user management and sessions using LocalStorage.
 */

const STORAGE_KEYS = {
    USERS: 'safecycle_users',
    CURRENT_USER: 'safecycle_current_user'
};

const Auth = {
    // === USERS ===
    getUsers: () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    },

    saveUser: (user) => {
        const users = Auth.getUsers();
        users.push(user);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return user;
    },

    findUserByEmail: (email) => {
        return Auth.getUsers().find(u => u.email === email);
    },

    findUserByCode: (code) => {
        return Auth.getUsers().find(u => u.uniqueCode === code);
    },

    // === AUTHENTICATION ===
    signup: (userData) => {
        if (Auth.findUserByEmail(userData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Generate ID and Timestamp
        const newUser = {
            ...userData,
            id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString()
        };

        Auth.saveUser(newUser);
        return { success: true, user: newUser };
    },

    login: (email, password) => {
        const user = Auth.findUserByEmail(email);
        if (user && user.password === password) {
            Auth.setCurrentUser(user);
            return { success: true, user };
        }
        return { success: false, message: 'Invalid email or password' };
    },

    loginWithCode: (code) => {
        const user = Auth.findUserByCode(code);
        if (user) {
            Auth.setCurrentUser(user);
            return { success: true, user };
        }
        return { success: false, message: 'Invalid access code' };
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        window.location.href = 'index.html';
    },

    // === SESSION ===
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    },

    setCurrentUser: (user) => {
        // Don't save password in session for security (simulation)
        const sessionUser = { ...user };
        delete sessionUser.password;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
    },

    requireAuth: () => {
        if (!Auth.getCurrentUser()) {
            window.location.href = 'login.html';
        }
    }
};

// Export for global usage
window.Auth = Auth;
