const sleep = require("./src/utils/sleep");
const repeat = require("./src/utils/repeat");
const customKeyTap = require("./src/utils/customKeyTap");
const moveBike = require("./src/utils/moveBike");
const getAllFiles = require("./src/utils/getAllFiles");
const excludeScreenShots = require("./src/utils/excludeScreenShots");
const checkColorPixel = require("./src/utils/checkColorPixel");
const setWindowFocus = require("./src/utils/setWindowFocus");
const configs = require("./config.json");

// const config = {
//   sweet_scent_key: "5",
//   teleport_key: "6",
//   bike_key: "1",
//   print_key: "0",
//   speed_steps: 0.2,
//   sweet_scent_amount_use: 6,
//   pp: 32,
// };

const SPEED_PRESS = configs.speed_prees_button;
let pp = configs.amount_uses.pp;

async function checkbattle() {
  return new Promise(async (resolve, reject) => {
    const filesToExclude = await getAllFiles();
    if (filesToExclude.length > 0) {
      await excludeScreenShots(filesToExclude);
    }

    console.log("print checkbattle");
    await repeat(
      1,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.print_screen)
    );

    const files = await getAllFiles();

    const color = await checkColorPixel(files[0], { x: 1024, y: 1 });
    if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
      console.log("batalha");
      resolve(true);
    } else {
      console.log("andando");
      resolve(false);
    }
  });
}

async function checkHorda() {
  return new Promise(async (resolve, reject) => {
    const filesToExclude = await getAllFiles();
    if (filesToExclude.length > 0) {
      await excludeScreenShots(filesToExclude);
    }

    console.log("print checkHorda");
    await repeat(
      1,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.print_screen)
    );

    const files = await getAllFiles();

    const color = await checkColorPixel(files[0], { x: 150, y: 102 });
    if (color[0] === 0 && color[1] === 0 && color[2] === 0) {
      console.log("sem horda");
      resolve(false);
    } else {
      console.log("horda");
      resolve(true);
    }
  });
}

async function battle() {
  console.log("entrando na batalha");
  await sleep(5.5);
  await repeat(
    4,
    SPEED_PRESS,
    async () => await customKeyTap(configs.keys.left)
  );
  await repeat(4, SPEED_PRESS, async () => await customKeyTap(configs.keys.up));
  const isHorda = await checkHorda();
  if (isHorda) {
    await repeat(
      4,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.right)
    );
    await repeat(
      4,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.down)
    );
    await repeat(
      2,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.button_z)
    );
    await sleep(8);
    await goToCenter();
  }
  console.log("atk");
  await repeat(
    2,
    SPEED_PRESS,
    async () => await customKeyTap(configs.keys.button_z)
  );
  await sleep(12);
  const isbattle = await checkbattle();
  if (isbattle) {
    await sleep(8);
    console.log("atk 2");
    await repeat(
      1,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.button_z)
    );
    await repeat(
      1,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.down)
    );
    await repeat(
      1,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.down)
    );
    await sleep(12);
  }
  console.log("saindo da batalha");
  pp--;
  console.log(`restam ${pp}s`);
  if (pp <= 2) {
    await goToCenter();
  } else {
    await resetRoute();
    await route();
  }
}

async function goToCenter() {
  notFoundPokemon = 0;
  console.log("teleportando para o centro pokemon");
  await repeat(
    1,
    SPEED_PRESS,
    async () => await customKeyTap(configs.keys.teleport)
  );

  await sleep(5);
  console.log("curando");
  await repeat(7, 1.5, async () => await customKeyTap(configs.keys.button_z));
  pp = configs.amount_uses.pp;
  await sleep(1);
  await run();
}

async function resetRoute() {
  console.log("resetando rota");
  await repeat(
    6,
    SPEED_PRESS,
    async () => await customKeyTap(configs.keys.down)
  );
  await repeat(
    6,
    SPEED_PRESS,
    async () => await customKeyTap(configs.keys.right)
  );
}

let notFoundPokemon = 0;
async function route() {
  console.log("seguindo rota");
  if (notFoundPokemon >= 6) {
    console.log("pokemon não encontrado");
    await goToCenter();
  } else {
    await repeat(
      4,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.up)
    );
    await repeat(
      2,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.left)
    );
    await repeat(
      3,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.down)
    );
    await repeat(
      5,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.left)
    );
    await repeat(
      2,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.down)
    );
    await repeat(
      6,
      SPEED_PRESS,
      async () => await customKeyTap(configs.keys.right)
    );

    const isbattle = await checkbattle();
    if (isbattle) {
      notFoundPokemon = 0;
      await battle();
    } else {
      notFoundPokemon++;
      console.log("rotas sem encontrar pokemon:", notFoundPokemon);
      await route();
    }
  }
}

async function run() {
  console.log("iniciando");
  await repeat(
    6,
    SPEED_PRESS,
    async () => await customKeyTap(configs.keys.down)
  );
  console.log("saindo do centro");
  await sleep(2);
  console.log("seguindo para rota de farm");

  // await repeat(7, SPEED_PRESS, async () => await customKeyTap(configs.keys.left));
  // await repeat(5, SPEED_PRESS, async () => await customKeyTap(configs.keys.up));
  // await repeat(2, SPEED_PRESS, async () => await customKeyTap(configs.keys.right));
  // await repeat(15, SPEED_PRESS, async () => await customKeyTap(configs.keys.up));
  // await repeat(17, SPEED_PRESS, async () => await customKeyTap(configs.keys.left));
  // await repeat(3, SPEED_PRESS, async () => await customKeyTap(configs.keys.up));
  // await repeat(6, SPEED_PRESS, async () => await customKeyTap(configs.keys.left));
  // await repeat(4, SPEED_PRESS, async () => await customKeyTap(configs.keys.down));
  await repeat(
    1,
    SPEED_PRESS,
    async () => await customKeyTap(configs.keys.bike)
  );
  await sleep(1);
  await repeat(
    1,
    SPEED_PRESS,
    async () => await customKeyTap(configs.keys.left)
  );
  await moveBike(configs.keys.left, 0.28);
  await repeat(1, SPEED_PRESS, async () => await customKeyTap(configs.keys.up));
  await moveBike(configs.keys.up, 1.45);
  await repeat(
    1,
    SPEED_PRESS,
    async () => await customKeyTap(configs.keys.left)
  );
  await moveBike(configs.keys.left, 1.38);
  await repeat(1, SPEED_PRESS, async () => await customKeyTap(configs.keys.up));
  await moveBike(configs.keys.up, 0.15);
  await repeat(
    1,
    SPEED_PRESS,
    async () => await customKeyTap(configs.keys.left)
  );
  await moveBike(configs.keys.left, 0.35);
  await repeat(
    1,
    SPEED_PRESS,
    async () => await customKeyTap(configs.keys.down)
  );
  await moveBike(configs.keys.down, 0.214);

  console.log("iniciando rota de farm");
  await resetRoute();
  const isbattle = await checkbattle();
  if (isbattle) {
    await battle();
  }
  await route();
}

async function main() {
  console.log("Coloque o pokemmo em foco");
  await setWindowFocus();
  await sleep(2);
  await run();
}

main();
// 14 p/s
