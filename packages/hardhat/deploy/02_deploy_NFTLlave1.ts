import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const initialOwner = deployer; // Puedes cambiar esto a otra dirección si es necesario.

  await deploy("NFTLLAVE1", {
    from: deployer,
    args: [initialOwner],
    log: true,
    gasLimit: 5000000, // Aquí es donde defines el límite de gas
  });
};

export default func;
func.tags = ["NFTLLAVE1"];
