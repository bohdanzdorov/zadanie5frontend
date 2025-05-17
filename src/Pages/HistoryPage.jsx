import { useEffect, useState } from "react";
import { InlineMath, BlockMath  } from "react-katex";
import axios from "axios";
import "../Styles/HistoryPage.css";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function HistoryPage() {
    const [questionStats, setQuestionStats] = useState([]);
    const [locationStats, setLocationStats] = useState([]);
    const [loading, setLoading] = useState(true);


    const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

    useEffect(() => {
        fetchStats();
    }, []);

    const getCountryChartData = () => {
        return locationStats.map(loc => ({
            name: `${loc.country_en} / ${loc.country_sk}`,
            value: loc.cities.reduce((acc, city) => acc + city.count, 0)
        }));
    };

    const chartColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

    const fetchStats = async () => {
        const token = localStorage.getItem("token");
        try {
            console.log("Sending token:", token);

            const res = await axios.get(`${API}/admin/history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setQuestionStats(res.data.questions_stats || []);
            setLocationStats(res.data.location_stats || []);
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
        if (confirm("Are you sure you want to clear all history?")) {
            try {
                await axios.delete(`${API}/admin/history/clear`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert("History cleared.");
                fetchStats(); // refresh
            } catch (err) {
                alert("Failed to clear history.");
            }
        }
    };


    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📊 Test Statistics</h2>

            <button className="button" onClick={handleExport}>⬇️ Export CSV</button>
            <button className="button danger" onClick={handleClear}>🗑️ Clear History</button>

            <h3 style={{ marginTop: 30 }}>🧠 Questions</h3>
            <table className="styled-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>EN</th>
                    <th>SK</th>
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
                        <td>{renderMixedLatex(q.question_text_en)}</td>
                        <td>{renderMixedLatex(q.question_text_sk)}</td>
                        <td>{q.field_en}</td>
                        <td>{q.included_in_tests}</td>
                        <td>{q.correct_count}</td>
                        <td>{q.incorrect_count}</td>
                        <td>{Number(q.average_time_spent).toFixed(1)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3 style={{ marginTop: 40 }}>🌍 Locations</h3>
            <div style={{ width: "100%", maxWidth: "500px", height: 300, margin: "2rem auto" }}>
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
                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}

function renderMixedLatex(text) {
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

    return parts.map((part, i) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
            return <BlockMath key={i} math={part.slice(2, -2)} />;
        } else if (part.startsWith('$') && part.endsWith('$')) {
            return <InlineMath key={i} math={part.slice(1, -1)} />;
        } else {
            return <span key={i}>{part}</span>;
        }
    });
}
