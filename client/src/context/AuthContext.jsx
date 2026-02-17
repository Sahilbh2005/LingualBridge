import * as React from 'react';
import axios from 'axios';

// Initial State
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
};

// Create Context
export const AuthContext = React.createContext(initialState);

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            };
        case 'REGISTER_SUCCESS':
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case 'REGISTER_FAIL':
        case 'AUTH_ERROR':
        case 'LOGIN_FAIL':
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload
            };
        case 'CLEAR_ERRORS':
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Provider Component
export const AuthProvider = ({ children }) => {
    console.log('AuthProvider rendering. React version:', React.version);
    const [state, dispatch] = React.useReducer(authReducer, initialState);

    // Load User
    const loadUser = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            dispatch({ type: 'AUTH_ERROR' });
            return;
        }

        setAuthToken(token);

        try {
            const res = await axios.get('http://localhost:5000/api/auth/me');
            dispatch({ type: 'USER_LOADED', payload: res.data });
        } catch (err) {
            dispatch({ type: 'AUTH_ERROR' });
        }
    };

    // Register User
    const register = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData, config);

            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: res.data
            });

            // Load user immediately or just set state
        } catch (err) {
            dispatch({
                type: 'REGISTER_FAIL',
                payload: err.response.data.message || 'Registration failed'
            });
        }
    };

    // Login User
    const login = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData, config);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: 'LOGIN_FAIL',
                payload: err.response.data.message || 'Login failed'
            });
        }
    };

    // Logout
    const logout = () => dispatch({ type: 'LOGOUT' });

    // Clear Errors
    const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

    React.useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                error: state.error,
                register,
                login,
                logout,
                clearErrors,
                loadUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Utils: Add token to headers
const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
};
