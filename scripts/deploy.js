const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners();
  
  const NAME = "CinemaTicket";
  const SYMBOL = "CTK";

  // Deploy contract
  const TokenMaster = await ethers.getContractFactory("CinemaTicket");
  const tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);
  await tokenMaster.deployed();

 //Consol View
 console.log("***********************************************************************************");
 console.log("Deploying contracts with the account:", deployer.address);
 console.log("Account balance:", (await deployer.getBalance()).toString());
 console.log("***********************************************************************************\n");
 console.log(`Cinema Ticket Contract at: ${tokenMaster.address}`,"\n");
 console.log("***********************************************************************************");

  // List 6 events
  const occasions = [
    {
      name: "Salaar",
      cost: tokens(0.00000123),
      tickets: 0,
      date: "Apr 23",
      time: "6:00PM",
      location: "PVR Oberoi Mall"
    },
    {
      name: "KGF Chapter 2",
      cost: tokens(0.00000213),
      tickets: 100,
      date: "Apr 2",
      time: "1:00PM",
      location: "Megaplex Inorbit Mall"
    },
    {
      name: "Devara",
      cost: tokens(0.11234599),
      tickets: 107,
      date: "Apr 9",
      time: "10:00AM",
      location: "MAISON INOX"
    },
    {
      name: "Transformer One",
      cost: tokens(0.21259),
      tickets: 0,
      date: "Apr 11",
      time: "2:30PM",
      location: "PVR Infinity Mall"
    },
    {
      name: "Solo Leveling: ReAwakening",
      cost: tokens(0.1),
      tickets: 125,
      date: "Apr 23",
      time: "11:00AM",
      location: "MovieMax Mira Road"
    }
    
  ];
  

  for (var i = 0; i < 5; i++) {
    const transaction = await tokenMaster.connect(deployer).list(
      occasions[i].name,
      occasions[i].cost,
      occasions[i].tickets,
      occasions[i].date,
      occasions[i].time,
      occasions[i].location
    );

    await transaction.wait();

    console.log(`Listed Event ${i + 1}: ${occasions[i].name}`);
    console.log("***********************************************************************************");

  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});