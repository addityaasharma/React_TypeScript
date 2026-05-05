import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            if (!email || !password) {
                alert("Please enter email and password");
                return;
            }

            setLoading(true);

            if (isLogin) {
                const res = await API.post("login/", {
                    email,
                    password,
                });

                localStorage.setItem("access", res.data.access);
                localStorage.setItem("refresh", res.data.refresh);

                navigate("/dashboard");
            } else {
                await API.post("signup/", {
                    email,
                    password,
                });

                alert("Signup successful, now login");
                setIsLogin(true);
            }
        } catch (err: any) {
            const message =
                err.response?.data?.detail ||
                err.response?.data?.error ||
                "Something went wrong";

            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    {isLogin ? "Login" : "Signup"}
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading
                        ? "Loading..."
                        : isLogin
                            ? "Login"
                            : "Signup"}
                </button>

                <p className="text-sm text-center mt-4">
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}
                    <span
                        className="ml-1 text-blue-500 cursor-pointer"
                        onClick={() => !loading && setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Signup" : "Login"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Auth;