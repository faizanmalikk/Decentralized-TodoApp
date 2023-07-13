import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
    developmentChains, networkConfig,

} from "../helper-hardhat-config"
import verify from "../utils/verify";

const deployTodoContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    let args: any = []

    log("----------------------------------------------------")
    log("Deploying TodoContract and waiting for confirmations...")
    const todoContract = await deploy("TodoList", {
        from: deployer,
        args: args,
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`TodoListContract at ${todoContract.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_PRIVATE_KEY) {
        await verify(todoContract.address, args)
    }
}

export default deployTodoContract
deployTodoContract.tags = ["all", "todoList"]