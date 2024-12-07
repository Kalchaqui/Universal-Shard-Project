import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying RBUToken...");

  // Desplegar el contrato RBUToken
  const rbuToken = await deploy("RBUToken", {
    from: deployer,
    args: [], // No se necesitan argumentos en el constructor
    log: true,
  });

  log(`RBUToken deployed at ${rbuToken.address}`);
};

export default func;
func.tags = ["RBUToken"];
