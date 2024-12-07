import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying RVToken...");

  // Usar una dirección ficticia si no tienes la real
  const collateralWallet = "0x0000000000000000000000000000000000000000"; // Dirección ficticia
  const routerAddress = "0x0000000000000000000000000000000000000000"; // Dirección nula para el enrutador

  if (collateralWallet === "0x0000000000000000000000000000000000000000") {
    console.warn("Warning: Using a dummy address for collateral wallet");
  }

  // Desplegar el contrato RVToken con la dirección nula del enrutador
  const rvToken = await deploy("RVToken", {
    from: deployer,
    args: [collateralWallet, routerAddress],
    log: true,
  });

  log(`RVToken deployed at ${rvToken.address}`);
};

export default func;
func.tags = ["RVToken"];
