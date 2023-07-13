import { deployments, ethers, getNamedAccounts } from "hardhat"
import { assert, expect } from "chai"
import { TodoList } from "../typechain-types"


describe("TodoList work flow", async () => {
    let todoList: TodoList
    let deployer: string


    beforeEach(async () => {

        deployer = (await getNamedAccounts()).deployer

        await deployments.fixture(['all'])
        todoList = await ethers.getContract('TodoList', deployer)
    })


    describe("constructor", async () => {
        it("sets the owner correctly", async () => {
            let response = await todoList.getOwnerAddress()
            assert.equal(response, deployer)
        })
    })

    describe("addTasks", async () => {
        it("only owner can add tasks", async () => {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnected = todoList.connect(attacker)
            await expect(attackerConnected.addTaks("this is testing")).to.be.revertedWithCustomError(todoList, 'TodoList__NotOwner')
        })
        it("it push correctly to the list", async () => {
            const desc = 'this is testing'
            await todoList.addTaks(desc)
            const allTasks = await todoList.getAllTaks()
            assert.equal(allTasks[0].desc, desc)
            assert.equal(allTasks[0].status, 0)
        })
    })

    describe("markAsFinished", async () => {

        beforeEach(async function () {
            await todoList.addTaks("this is testing");
        });
        it("it reverts if task not found", async () => {
            await expect(todoList.markAsFinished(1)).to.be.revertedWithCustomError(todoList, 'TodoList__TaskNotExists')
        })
        it("updated the status to finished", async () => {
            await todoList.markAsFinished(0)
            const allTasks = await todoList.getAllTaks()
            assert.equal(allTasks[0].status, 1)
        })
    })

    describe("getSingleTask", async () => {

        const desc = 'this is testing'

        beforeEach(async function () {
            await todoList.addTaks(desc);
        });

        it("it reverts if task not found", async () => {
            await expect(todoList.getSingleTask(1)).to.be.revertedWithCustomError(todoList, 'TodoList__TaskNotExists')
        })
        it("should return the tasks correctly", async () => {
            const task = await todoList.getSingleTask(0)
            assert.equal(task.status, 0)
            assert.equal(task.desc, desc)
        })
    })

})