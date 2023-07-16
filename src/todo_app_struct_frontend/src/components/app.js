import React, { useEffect, useRef, useState } from "react";
import { todo_app_struct_backend as backend } from "../../../declarations/todo_app_struct_backend";
import { Form, Popconfirm, Spin, Tooltip } from "antd";
import useMessage from "antd/es/message/useMessage";

const TaskCard = (props) => {
    var _onClick = props.onClick ? props.onClick : (parms) => { console.log(`You've clicked to update ${parms}`) };
    var _onRemove = props.onRemove ? props.onRemove : (parms) => { console.log(`You've clicked to close ${parms}`) };
    return (
        <div className="bg-gray-200 px-4 py-2 flex justify-between items-center gap-4">
            <div onClick={(e) => { _onClick(props.task, props.isCompleted) }} className={`w-full cursor-pointer ${props.isCompleted ? "line-through" : ""}`}>{props.task}</div>
            <Tooltip placement="right" title="Remove task">
                <Popconfirm title="Are you sure?" description={"This action can't be undone"} onConfirm={() => _onRemove(props.task)}>
                    <div className="font-semibold text-xl cursor-pointer text-gray-700">x</div>
                </Popconfirm>
            </Tooltip>
        </div>
    )
}
const App = () => {
    const isMounted = useRef(false);
    const [allTasks, setAllTasks] = useState({});
    const [loading, setLoading] = useState(true);
    const [messageApi, messageApiProvider] = useMessage();
    const [isUpdateOnProgress, setIsUpdateOnProgress] = useState(false);
    useEffect(async () => {
        if (!isMounted.current) {
            isMounted.current = true;
            setAllTasks(processData(await backend.fetchAllData()));
            setLoading(false);
        }
    }, [])
    function processData(rawData) {
        var tmp = {};
        rawData.map((val, index) => {
            tmp[index] = val[1];
        })
        return tmp;
    }
    const handleUpdateTaskAction = async (task, isCompleted) => {
        messageApi.loading("Updating...", 120);
        setIsUpdateOnProgress(true);
        var updateTask = await backend.updateData(task, !isCompleted);
        setAllTasks(processData(await backend.fetchAllData()));
        messageApi.destroy();
        setIsUpdateOnProgress(false);
    }
    const handleRemoveTaskAction = async (task) => {
        setIsUpdateOnProgress(true);
        var remove = await backend.removeData(task);
        setAllTasks(processData(await backend.fetchAllData()));
        setIsUpdateOnProgress(false);
        messageApi.success("Task deleted");
    }
    const handleAddTaskAction = async (e) => {
        e.preventDefault();
        var fd = new FormData(e.target);
        var newTask = fd.get('newTask');
        if (newTask == "") {
            messageApi.error("Please enter a task to add!");
            return false;
        }
        messageApi.loading("Adding new task...", 120)
        setIsUpdateOnProgress(true);
        document.getElementById("submitBtn").disabled = true;
        var addNew = await backend.addData(newTask, false);
        document.getElementById("submitBtn").disabled = false;
        setAllTasks(processData(await backend.fetchAllData()));
        messageApi.destroy();
        setIsUpdateOnProgress(false);
        messageApi.success("Task added");
        e.target.reset();
    }
    return (
        <>
            <div className="my-12 flex justify-center items-center">
                <div className={`bg-white rounded-md p-8 w-[50%] flex flex-col justify-center ${isUpdateOnProgress ? "animate-pulse disabled" : ""}`}>
                    <h1 className="text-xl font-semibold text-center">My Todos (ICP dApp)</h1>
                    <div className="flex flex-col gap-4 my-12">
                        <form autoComplete="off" className="flex gap-2" onSubmit={handleAddTaskAction}>
                            <input name="newTask" className="w-full bg-gray-100 rounded-md p-2 px-4 focus:outline-none focus:drop-shadow-sm focus:bg-gray-200 outline-transparent duration-200 ease-in-out text-gray-800" placeholder="Type something" />
                            <button id="submitBtn" className="p-2 rounded-md bg-blue-400 text-white px-4 hover:bg-blue-500 active:bg-blue-600">Add</button>
                        </form>
                        {loading && (<div className="m-12 flex item-center justify-center">
                            <Spin />
                        </div>)
                            || <><div className="mt-4">
                                <h2 className="font-bold text-lg">Tasks: </h2>
                                <div className="mt-2 flex flex-col gap-3">
                                    {
                                        Object.keys(allTasks).length == 0 && <div className="bg-gray-200 px-4 py-2 flex justify-between items-center gap-4">No tasks found!</div>
                                        || Object.keys(allTasks).map(key => {
                                            return (
                                                <TaskCard onRemove={handleRemoveTaskAction} onClick={handleUpdateTaskAction} task={allTasks[key].task} isCompleted={allTasks[key].isCompleted} />
                                            )
                                        })}
                                </div>
                            </div></>}
                    </div>
                </div>
            </div>
            {messageApiProvider}
        </>
    )
}
export default App;