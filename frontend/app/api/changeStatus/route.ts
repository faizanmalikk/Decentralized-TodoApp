
import { ethers } from "ethers";
import { NextResponse } from "next/server";
import * as Constants from "../../utils/config"


export async function POST(
    request: Request
) {
    try {
        const index = await request.json();
        const provider = new ethers.providers.JsonRpcProvider(Constants.API_URL);
        const signer = new ethers.Wallet(Constants.PRIVATE_KEY as string, provider);
        const contract = new ethers.Contract(Constants.contractAddress, Constants.contractAbi, signer);
        const tx = await contract.markAsFinished(index);
        await tx.wait();

        return NextResponse.json({
            success: true,
        });
    }

    catch (err) {
        console.error(err);
    }
}


