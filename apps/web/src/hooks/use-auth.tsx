import { getUser } from "@/lib/api/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";

type User = Awaited<ReturnType<typeof getUser>>;

type AuthContextType = {
    user: User;
    isLoading: boolean;
    ensureUser: () => Promise<User>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const getUserQueryOptions = {
    queryKey: ["user"],
    queryFn: getUser,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery(getUserQueryOptions);

    const ensureUser = async () => {
        return queryClient.ensureQueryData(getUserQueryOptions);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                ensureUser,
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
