import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const nftLlave1Address = "0xdda36A853A8BE82ebc2Cc12ebee2C5aBb569212b"; // Dirección a actualizar tras el despliegue
  const rbuTokenAddress = "0xf8bF1c13fc62e9a09e4e9e549431f950135Dd315"; // Dirección a actualizar tras el despliegue
  const rvTokenAddress = "0xfBa1aEc8DF5124477669AabDa6eaDdad4faDB48a"; // Dirección a actualizar tras el despliegue
  const faccionTokenAddress = "0x39cfe1715846d19477779b4C1331e06cC27BCDdc"; // Dirección a actualizar tras el despliegue
  const walletColateralAddress = "0x8869685b9a5bF8a8450B9fE9944E5E3D287d8F77"; // Dirección a actualizar según configuración

  await deploy("Enrutador", {
    from: deployer,
    args: [
      nftLlave1Address,
      rbuTokenAddress,
      rvTokenAddress,
      faccionTokenAddress,
      walletColateralAddress,
    ],
    log: true,
  });
};

export default func;
func.tags = ["Enrutador"];
