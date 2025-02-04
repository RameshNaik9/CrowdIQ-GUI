import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../services/api"; // Import API function
import { FcGoogle } from "react-icons/fc";

const GoogleLogin = ({ setUser }) => {
    const responseGoogle = async (authResult) => {
        try {
            if (authResult["code"]) {
                console.log("Auth Code:", authResult.code);
                
                // Send auth code to backend
                const result = await googleAuth(authResult.code);
                console.log("Login Successful:", result.data);

                // Store user details & token
                setUser(result.data.data.user);
                localStorage.setItem("token", result.data.token);
                localStorage.setItem("user", JSON.stringify(result.data.data.user));

                // Redirect to Camera Configuration Page
                window.location.href = "/camera-configuration";
            } else {
                alert("Google Authentication Failed. Please try again.");
                throw new Error("Google Auth failed");
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            alert("Login Unsuccessful! Please try again.");
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: "auth-code",
    });

    return (
        <button
            className="mt-6 w-full flex items-center justify-center gap-3 bg-white text-gray-900 px-4 py-3 rounded-lg shadow-md hover:bg-gray-200 transition font-semibold"
            onClick={googleLogin}
        >
            <FcGoogle size={24} />
            Continue with Google
        </button>
    );
};

export default GoogleLogin;
