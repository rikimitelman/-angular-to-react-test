import { useContext } from "react";
import { TasksContext } from "../context/tasks.context";

export const useTasks = () => {
    const context = useContext(TasksContext);

    if (!context) {
        throw new Error(
            'TasksContext is not initialized'
        );
    }

    return context;
}