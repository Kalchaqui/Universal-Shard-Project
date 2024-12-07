import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying UnifiedFactionToken...");

  // Direcciones necesarias
  const routerAddress = "0x0000000000000000000000000000000000000000"; // Dirección dummy
  const initialOwner = "0x8869685b9a5bF8a8450B9fE9944E5E3D287d8F77"; // Dirección válida del propietario inicial

  // Validación: Asegurarse de que no es una dirección dummy
  if (initialOwner.toLowerCase() === "0x0000000000000000000000000000000000000000") {
    throw new Error("La dirección del propietario inicial no puede ser la dirección cero.");
  }

  // Desplegar el contrato UnifiedFactionToken
  const unifiedFactionToken = await deploy("UnifiedFactionToken", {
    from: deployer,
    args: [routerAddress, initialOwner],
    log: true,
  });

  log(`UnifiedFactionToken deployed at ${unifiedFactionToken.address}`);
};

export default func;
func.tags = ["UnifiedFactionToken"];
