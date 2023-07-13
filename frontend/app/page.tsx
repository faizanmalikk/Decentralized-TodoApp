'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import * as Constants from "../app/utils/config"
import { ethers } from "ethers";

interface Task {
  desc: String,
  status: Number
}

function App() {

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const connectToMetamask = async () => {
      try {
        if ((window as any).ethereum) {
          const provider = new ethers.providers.Web3Provider((window as any).ethereum);
          await (window as any).ethereum.enable();
          const signer = provider.getSigner();
          console.log(await signer.getAddress());
          const contractInstance = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
          var tasks = await contractInstance.getAllTaks();
          setTasks(tasks);
          console.log(tasks);
        }
        else {
          console.log("Metamask not found");
        }

      }
      catch (err) {
        console.error(err)
      }
    };

    connectToMetamask();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/api/addTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error);
    } else {
      alert('Task has been added')
    }



  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);

  }

  const changeTaskStatus = async (taskId: Number) => {
    const response = await fetch('/api/changeStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskId)
    });
    if (!response.ok) {
      const error = await response.json();
      console.log(error);
    } else {
      alert('Status has been updated')
    }
  }

  return (
    <div>
      <div className={'container'}>Welcome to the Decentralized To Do Application</div>
      <div className={'container'}>
        <form className={'form'} onSubmit={handleSubmit}>
          <input type="text" name="task" placeholder="Add task here ..." onChange={handleChange} value={task} />
          <input type="submit" value="Add Task" />
        </form>
      </div>
      <div className={'container'}>
        <table className={'table'}>
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Task Description</th>
              <th>Task Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{task.desc}</td>
                <td>{task.status === 0 ? 'Pending' : 'Finished'}</td>
                <td >
                  {task.status === 0 ? <button className={'button'} onClick={() => changeTaskStatus(index)}>Click me</button> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default App;