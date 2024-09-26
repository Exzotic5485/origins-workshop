import { getUser } from "@/lib/api/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    user?: {
        id: number;
        username: string;
        email: string;
    };
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context)
        throw new Error(
            "The component that used 'useAuth' must be wrapped in an 'AuthProvider'."
        );

    return context;
}
