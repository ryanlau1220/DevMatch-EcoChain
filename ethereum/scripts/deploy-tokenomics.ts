import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Deploy EcoChain Token
  const ecoChainToken = await deploy('EcoChainToken', {
    from: deployer,
    args: [deployer],
    log: true,
  });

  // Deploy Data Credit Token
  const dataCredit = await deploy('DataCredit', {
    from: deployer,
    args: [deployer],
    log: true,
  });

  // Deploy Staking Contract
  const staking = await deploy('EcoChainStaking', {
    from: deployer,
    args: [ecoChainToken.address, deployer],
    log: true,
  });

  // Deploy Liquidity Manager
  const liquidityManager = await deploy('EcoChainLiquidityManager', {
    from: deployer,
    args: [
      ecoChainToken.address,
      dataCredit.address,
      process.env.UNISWAP_ROUTER_ADDRESS, // Make sure to set this in your .env file
      deployer,
    ],
    log: true,
  });

  // Verify contracts on Etherscan if not on a local network
  if (hre.network.name !== 'localhost' && hre.network.name !== 'hardhat') {
    console.log('Verifying contracts...');
    
    await hre.run('verify:verify', {
      address: ecoChainToken.address,
      constructorArguments: [deployer],
    });

    await hre.run('verify:verify', {
      address: dataCredit.address,
      constructorArguments: [deployer],
    });

    await hre.run('verify:verify', {
      address: staking.address,
      constructorArguments: [ecoChainToken.address, deployer],
    });

    await hre.run('verify:verify', {
      address: liquidityManager.address,
      constructorArguments: [
        ecoChainToken.address,
        dataCredit.address,
        process.env.UNISWAP_ROUTER_ADDRESS,
        deployer,
      ],
    });
  }
};

export default func;
func.tags = ['Tokenomics'];
