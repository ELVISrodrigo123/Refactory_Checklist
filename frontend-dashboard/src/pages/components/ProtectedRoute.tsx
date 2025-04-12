"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "../services/authStorage";

const ProtectedRoute = (WrappedComponent: React.ComponentType) => {
    return function ProtectedComponent(props: any) {
        const router = useRouter();

        useEffect(() => {
            const checkAuth = async () => {
                const token = getAccessToken();
                if (!token) {
                    router.push("/login");
                }
            };

            checkAuth();
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default ProtectedRoute;