import { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/HistoryPage.css";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MathText } from "../Components/MathText.jsx";
import BackButton from "../Components/BackButton.jsx";

export default function HistoryPage() {
    const [questionStats, setQuestionStats] = useState([]);
    const [locationStats, setLocationStats] = useState([]);
    const [language, setLanguage] = useState("en");
    const [totalTests, setTotalTests] = useState(0);
    const [loading, setLoading] = useState(true);

    const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

    useEffect(() => {
        fetchStats();
    }, []);

    const getCountryChartData = () => {
        return locationStats.map(loc => ({
            name: language === "sk"
                ? loc.country_sk
                : loc.country_en,
            value: loc.cities.reduce((acc, city) => acc + city.count, 0)
        }));
    };

    const chartColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

    const fetchStats = async () => {
        const token = localStorage.getItem("token");

        try {
            const profileRes = await axios.get(`${API}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLanguage(profileRes.data.user.language || "en");

            const statsRes = await axios.get(`${API}/admin/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuestionStats(statsRes.data.questions_stats || []);
            setLocationStats(statsRes.data.location_stats || []);
            setTotalTests(statsRes.data.total_tests || 0);
        } catch (err) {
            console.error("Error loading stats:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const token = localStorage.getItem("token");
        const exportUrl = `${API}/admin/history/export?token=${token}`;
        window.open(exportUrl, "_blank");
    };

    const handleClear = async () => {
        const token = localStorage.getItem("token");

        try {
            await axios.delete(`${API}/admin/history/clear`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("History cleared.");
            fetchStats();
        } catch (err) {
            console.error("Failed to clear history.");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="main-div">
            <BackButton/>
            <div className="history-wrapper">
                <div className="history-container">
                    <h2>📊 Test Statistics</h2>
                    <p><strong>Total tests taken:</strong> {totalTests}</p>

                    <div className="button-container">
                        <button className="button" onClick={handleExport}>⬇️ Export CSV</button>
                        <button className="button danger" onClick={handleClear}>🗑️ Clear History</button>
                    </div>

                    <div className="history-table-section">
                        <h3>🧠 Questions</h3>
                        <table className="styled-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>{language === "sk" ? "SK" : "EN"}</th>
                                <th>Field</th>
                                <th>Included</th>
                                <th>Correct</th>
                                <th>Incorrect</th>
                                <th>Avg Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {questionStats.map(q => (
                                <tr key={q.question_id}>
                                    <td>{q.question_id}</td>
                                    <td><MathText text={language === "sk" ? q.question_text_sk : q.question_text_en}/>
                                    </td>
                                    <td>{language === "sk" ? q.field_sk : q.field_en}</td>
                                    <td>{q.included_in_tests}</td>
                                    <td>{q.correct_count}</td>
                                    <td>{q.incorrect_count}</td>
                                    <td>{Number(q.average_time_spent).toFixed(1)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="chart-section">
                        <h3 style={{marginTop: 40}}>🌍 Locations</h3>
                        <div className="chart-wrapper">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={getCountryChartData()}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={100}
                                        label
                                    >
                                        {getCountryChartData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
