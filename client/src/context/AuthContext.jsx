import React, { createContext, useContext, useState, useEffect } from 'react';

// 创建Context
const AuthContext = createContext();

// 自定义Hook，供所有组件使用
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider组件，包裹整个App
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化时检查登录状态
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 登录方法
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 登出方法
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 上下文值
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;