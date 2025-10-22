import { TextField, Typography, IconButton, Box, FormControl, InputAdornment, Checkbox } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { useState, useEffect } from "react";

interface TasksType {
	id: number;
	task: string;
	status: boolean;
}

export default function ToDo() {
	const [newTask, setNewTask] = useState("");
	const [tasks, setTasks] = useState<TasksType[]>(() => {
		const savedTasks = localStorage.getItem("tasks");
		return savedTasks ? JSON.parse(savedTasks) : [];
	});
	const [showError, setShowError] = useState(false);
	const [editTaskId, setEditTaskId] = useState<number | null>(null);
	const [editTaskValue, setEditTaskValue] = useState("");

	useEffect(() => {
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}, [tasks]);

	function handelChangeNewTask(e: React.ChangeEvent<HTMLInputElement>) {
		setNewTask(e.target.value);
	}

	function handleAddNewTaskClick() {
		if (!newTask.trim()) {
			setShowError(true);
			setTimeout(() => {
				setShowError(false);
			}, 2000);
			return;
		}

		const newTaskObject = {
			id: Date.now(),
			task: newTask,
			status: false,
		};
		const updatedTasks: TasksType[] = [...tasks, newTaskObject];
		setTasks(updatedTasks);
		setNewTask("");
		setShowError(false);
	}

	function handleChangeCheckbox(taskChange: TasksType) {
		const updatedTasks = tasks.map((t) => (t.id === taskChange.id ? { ...t, status: !t.status } : t));
		setTasks(updatedTasks);
	}

	function handleDeleteTaskClick(id: number) {
		setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
	}

	function handleChangeTask(task: TasksType) {
		setTasks(
			tasks.map((t) => {
				if (t.id === task.id) {
					return task;
				} else {
					return t;
				}
			})
		);
	}

	const activeTasks = tasks.filter((t) => !t.status);
	const completeTasks = tasks.filter((t) => t.status);
    
	return (
		<Box sx={{ border: "0.5px solid black", borderRadius: "10px", alignItems: "center", justifyContent: "center", minHeight: "766px", width: "514px", margin: "20px" }}>
			<Typography
				variant="h3"
				sx={{ textAlign: "start", margin: "44px 44px 20px 44px" }}
			>
				TODO
			</Typography>
			<FormControl>
				{showError ? (
					<TextField
						error
						variant="standard"
						id="outlined-error"
						label="Введите задачу"
						value={""}
						sx={{ marginLeft: "44px", width: "426px" }}
					/>
				) : (
					<TextField
						variant="standard"
						label="Имя новой задачи"
						placeholder="Введите задачу"
						sx={{ marginLeft: "44px", width: "426px" }}
						slotProps={{
							input: {
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={handleAddNewTaskClick}>
											<AddOutlinedIcon />
										</IconButton>
									</InputAdornment>
								),
							},
						}}
						onChange={handelChangeNewTask}
						value={newTask}
					/>
				)}
			</FormControl>
			{activeTasks.length > 0 && (
				<Box>
					<Box sx={{ textAlign: "center", marginTop: "20px", fontSize: "12px", fontWeight: "400" }}>План({activeTasks.length})</Box>
					{activeTasks.map((task) =>
						task.id === editTaskId ? (
							<TextField
								variant="standard"
								sx={{ marginLeft: "44px", width: "426px", marginTop: "12px" }}
								key={task.id}
								value={editTaskValue}
								onChange={(e) => setEditTaskValue(e.target.value)}
								slotProps={{
									input: {
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													onClick={() => {
														handleChangeTask({ ...task, task: editTaskValue });
														setEditTaskId(null);
													}}
												>
													<DoneOutlinedIcon />
												</IconButton>
											</InputAdornment>
										),
									},
								}}
							/>
						) : (
							<Typography
								key={task.id}
								sx={{
									marginLeft: "44px",
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									width: "426px",
									marginTop: "12px",
									cursor: "pointer",
								}}
								onClick={() => {
									setEditTaskId(task.id);
									setEditTaskValue(task.task);
								}}
							>
								<Typography sx={{ display: "flex", gap: "9px", alignItems: "center", justifyContent: "center" }}>
									<Checkbox
										checked={task.status}
										onChange={() => handleChangeCheckbox(task)}
									/>
									{task.task}
								</Typography>
								<InputAdornment position="end">
									<IconButton onClick={() => handleDeleteTaskClick(task.id)}>
										<DeleteIcon />
									</IconButton>
								</InputAdornment>
							</Typography>
						)
					)}
				</Box>
			)}
			{completeTasks.length > 0 && (
				<Box>
					<Box sx={{ textAlign: "center", marginTop: "20px", fontSize: "12px", fontWeight: "400" }}>Готово({completeTasks.length})</Box>
					{completeTasks.map((task) => (
						<Typography
							key={task.id}
							sx={{ marginLeft: "44px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "426px", marginTop: "12px" }}
						>
							<Typography sx={{ display: "flex", gap: "9px", alignItems: "center", justifyContent: "center" }}>
								<Checkbox
									checked={task.status}
									onChange={() => handleChangeCheckbox(task)}
								/>
								{task.task}
							</Typography>
							<InputAdornment position="end">
								<IconButton onClick={() => handleDeleteTaskClick(task.id)}>
									<DeleteIcon />
								</IconButton>
							</InputAdornment>
						</Typography>
					))}
				</Box>
			)}
		</Box>
	);
}
