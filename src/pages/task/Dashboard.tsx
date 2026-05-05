import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

interface Task {
    id: number;
    title: string;
    description: string;
    is_completed: boolean;
}

const Dashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    const [fetchingTasks, setFetchingTasks] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const fetchTasks = async () => {
        try {
            setFetchingTasks(true);
            const res = await API.get("tasks/");

            if (Array.isArray(res.data)) {
                setTasks(res.data);
            } else if (res.data?.results) {
                setTasks(res.data.results);
            } else {
                setTasks([]);
            }
        } catch (err) {
            console.log("Fetch error:", err);
            setTasks([]);
        } finally {
            setFetchingTasks(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSubmit = async () => {
        try {
            if (!title.trim()) return;
            setSubmitting(true);

            if (editingId) {
                await API.put(`tasks/${editingId}/`, { title, description });
                setEditingId(null);
            } else {
                await API.post("tasks/", { title, description });
            }

            setTitle("");
            setDescription("");
            fetchTasks();
        } catch (err) {
            console.log("Submit error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (task: Task) => {
        setTitle(task.title);
        setDescription(task.description);
        setEditingId(task.id);
    };

    const handleDelete = async (id: number) => {
        try {
            setDeletingId(id);
            await API.delete(`tasks/${id}/`);
            fetchTasks();
        } catch (err) {
            console.log("Delete error:", err);
        } finally {
            setDeletingId(null);
        }
    };

    const toggleComplete = async (task: Task) => {
        try {
            setTogglingId(task.id);
            await API.patch(`tasks/${task.id}/`, {
                is_completed: !task.is_completed,
            });
            fetchTasks();
        } catch (err) {
            console.log("Toggle error:", err);
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">

                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Task Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>

                <input
                    className="w-full mb-2 p-2 border rounded disabled:opacity-50"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={submitting}
                />

                <input
                    className="w-full mb-2 p-2 border rounded disabled:opacity-50"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={submitting}
                />

                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-black text-white p-2 rounded mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting
                        ? editingId ? "Updating..." : "Adding..."
                        : editingId ? "Update Task" : "Add Task"}
                </button>

                {/* Task List */}
                {fetchingTasks ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : Array.isArray(tasks) && tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className="border p-3 mb-2 rounded flex justify-between items-center"
                        >
                            <div>
                                <h3 className={`font-semibold ${task.is_completed ? "line-through text-gray-400" : ""}`}>
                                    {task.title}
                                </h3>
                                <p className="text-sm text-gray-500">{task.description}</p>
                            </div>

                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => toggleComplete(task)}
                                    disabled={togglingId === task.id}
                                    className="text-green-600 disabled:opacity-50 disabled:cursor-not-allowed w-6 text-center"
                                >
                                    {togglingId === task.id
                                        ? <span className="inline-block w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                        : "✓"}
                                </button>

                                <button
                                    onClick={() => handleEdit(task)}
                                    disabled={submitting}
                                    className="text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(task.id)}
                                    disabled={deletingId === task.id}
                                    className="text-red-600 disabled:opacity-50 disabled:cursor-not-allowed w-12 text-center"
                                >
                                    {deletingId === task.id
                                        ? <span className="inline-block w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                        : "Delete"}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No tasks found</p>
                )}

            </div>
        </div>
    );
};

export default Dashboard;