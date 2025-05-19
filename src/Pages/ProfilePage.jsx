import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Password} from "primereact/password";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import axios from "axios";
import "../Styles/AuthPages.css";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // Show/hide password change form
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    // Show/hide tests history
    const [showTestsHistory, setShowTestsHistory] = useState(false);
    // User tests history
    const [testsHistory, setTestsHistory] = useState([]);
    const [loadingTests, setLoadingTests] = useState(false);

    // Profile form data
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [language, setLanguage] = useState("en");

    // Password change form data
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", {replace: true});
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const userData = response.data.user;
                setUser(userData);
                setName(userData.name);
                setEmail(userData.email);
                setLanguage(userData.language);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile data");

                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    navigate("/login", {replace: true});
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [API, navigate]);

    const fetchUserTests = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", {replace: true});
            return;
        }

        setLoadingTests(true);
        try {
            const response = await axios.get(`${API}/my-tests`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Process the tests from the new API structure
            const processedTests = response.data.tests.map(test => ({
                id: test.id,
                created_at: test.location.start_time,
                location: `${test.location?.city?.en || 'Unknown'}, ${test.location?.country?.en || 'Unknown'}`,
                total: test.statistics.total_questions,
                correct: test.statistics.correct_answers,
                score: test.statistics.accuracy_percent,
                time_spent: test.statistics.total_time_spent
            }));
            setTestsHistory(processedTests);
        } catch (err) {
            console.error("Error fetching user tests:", err);
            setError("Failed to load test history");

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login", {replace: true});
            }
        } finally {
            setLoadingTests(false);
        }
    };

    const toggleTestsHistory = () => {
        const newState = !showTestsHistory;
        setShowTestsHistory(newState);

        if (newState) {
            fetchUserTests();
        }
    };
    const formatTimeSpent = (seconds) => {
        if (seconds < 60) {
            return `${seconds} sec`;
        } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return remainingSeconds > 0 ?
                `${minutes} min ${remainingSeconds} sec` :
                `${minutes} min`;
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", {replace: true});
            return;
        }

        setError("");
        setSuccess("");

        try {
            const response = await axios.patch(
                `${API}/profile`,
                {name, email, language},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setUser(response.data.user);
            setSuccess("Profile updated successfully");
        } catch (err) {
            console.error("Error updating profile:", err);

            if (err.response?.data?.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat();
                setError(validationErrors.join(", "));
            } else {
                setError(err.response?.data?.error || "Failed to update profile");
            }
        }
    };

    const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
        // Reset form fields and errors when toggling
        if (!showPasswordForm) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError("");
            setPasswordSuccess("");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", {replace: true});
            return;
        }

        setPasswordError("");
        setPasswordSuccess("");

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords don't match");
            return;
        }

        try {
            await axios.post(
                `${API}/change-password`,
                {
                    current_password: currentPassword,
                    password: newPassword,
                    password_confirmation: confirmPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setPasswordSuccess("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error("Error changing password:", err);

            if (err.response?.data?.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat();
                setPasswordError(validationErrors.join(", "));
            } else {
                setPasswordError(err.response?.data?.error || "Failed to change password");
            }
        }
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleString();
    };

    if (loading) {
        return (
            <div className="profile-container" style={{width: '80%', margin: '0 auto', padding: '2rem'}}>
                <Card title="Profile" style={{width: '100%'}}>
                    <p>Loading profile data...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="profile-container" style={{width: '80%', margin: '0 auto', padding: '2rem'}}>
            <Card title="My Profile" style={{width: '100%'}}>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message" style={{
                    background: "#edfaef",
                    color: "#2e7d32",
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                    borderLeft: "4px solid #2e7d32"
                }}>{success}</div>}

                <form onSubmit={handleUpdateProfile}>
                    <div className="field">
                        <label htmlFor="name">Name</label>
                        <InputText
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{width: '100%'}}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{width: '100%'}}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="language">Language</label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ced4da'
                            }}
                        >
                            <option value="en">English</option>
                            <option value="sk">Slovak</option>
                        </select>
                    </div>

                    <div className="flex flex-wrap justify-content-between" style={{marginTop: '1rem'}}>
                        <Button
                            type="submit"
                            label="Update Profile"
                            className="auth-button"
                            style={{width: 'auto'}}
                        />
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                label={showTestsHistory ? "Hide Tests History" : "View Tests History"}
                                className={showTestsHistory ? "p-button-outlined p-button-primary" : "p-button-outlined"}
                                icon={showTestsHistory ? "pi pi-eye-slash" : "pi pi-eye"}
                                onClick={toggleTestsHistory}
                                style={{width: 'auto'}}
                            />
                            <Button
                                type="button"
                                label={showPasswordForm ? "Cancel Password Change" : "Change Password"}
                                className={showPasswordForm ? "p-button-outlined p-button-secondary" : "p-button-outlined"}
                                icon={showPasswordForm ? "pi pi-times" : "pi pi-lock"}
                                onClick={togglePasswordForm}
                                style={{width: 'auto'}}
                            />
                        </div>
                    </div>
                </form>

                {showTestsHistory && (
                    <div style={{margin: "2rem 0", borderTop: "1px solid #eee", paddingTop: "1rem"}}>
                        <h3>My Tests History</h3>

                        {loadingTests ? (
                            <p>Loading tests history...</p>
                        ) : testsHistory.length === 0 ? (
                            <p>No test history found. Complete a test to see your results here.</p>
                        ) : (
                            <DataTable
                                value={testsHistory}
                                paginator
                                rows={5}
                                rowsPerPageOptions={[5, 10, 25]}
                                style={{width: '100%'}}
                            >
                                <Column field="id" header="Test ID" sortable style={{width: '8%'}}></Column>
                                <Column field="created_at" header="Date" body={(rowData) => formatDate(rowData.created_at)}
                                        sortable style={{width: '20%'}}></Column>
                                <Column field="location" header="Location" sortable style={{width: '17%'}}></Column>
                                <Column field="score" header="Score" body={(rowData) => `${rowData.score}%`} sortable
                                        style={{width: '10%'}}></Column>
                                <Column field="correct" header="Correct" sortable
                                        style={{width: '10%'}}></Column>
                                <Column field="total" header="Total" sortable style={{width: '10%'}}></Column>
                                <Column field="time_spent" header="Time Spent"
                                        body={(rowData) => formatTimeSpent(rowData.time_spent)} sortable
                                        style={{width: '15%'}}></Column>
                            </DataTable>
                        )}
                    </div>
                )}

                {showPasswordForm && (
                    <div style={{margin: "2rem 0", borderTop: "1px solid #eee", paddingTop: "1rem"}}>
                        <h3>Change Password</h3>

                        {passwordError && <div className="error-message">{passwordError}</div>}
                        {passwordSuccess && <div className="success-message" style={{
                            background: "#edfaef",
                            color: "#2e7d32",
                            padding: "0.75rem",
                            width: '100%',
                            borderRadius: "4px",
                            marginBottom: "1rem",
                            borderLeft: "4px solid #2e7d32"
                        }}>{passwordSuccess}</div>}

                        <form onSubmit={handleChangePassword}>
                            <div className="field">
                                <label htmlFor="currentPassword">Current Password</label>
                                <Password
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    toggleMask
                                    feedback={false}
                                    inputStyle={{width: '100%'}}
                                    inputClassName="w-100"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="newPassword">New Password</label>
                                <Password
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    toggleMask
                                    inputStyle={{width: '100%'}}
                                    inputClassName="w-100"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <Password
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    toggleMask
                                    feedback={false}
                                    inputStyle={{width: '100%'}}
                                    inputClassName="w-100"
                                />
                            </div>

                            <Button
                                type="submit"
                                label="Change Password"
                                icon="pi pi-check"
                                className="auth-button"
                                style={{width: 'auto'}}
                            />
                        </form>
                    </div>
                )}
            </Card>
        </div>
    );
}