export default {
  civilizations: [
    {
      name: "Mermopolis",
      player: "Marum",
      flag_image:
        "08IWWaa0;1FHWWaa0;0HIWWbb0;1F8WWWW0;088WWLL0;0o1WZKKO;008VWOC0;0o1RTDD0;0o1bTDDC",
      primary_color: 18,
      state: {
        day: 1,
        title: "Dia 1",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        orders: [
          {
            description: "Mandar un trabajador a la granja",
            position: { x: 464, y: 288 },
          },
        ],
        entities: [
          {
            name: "Campamento acerradero",
            description:
              "Un puesto de trabajo con herramientas de tala. Produce 4 de madera por cada trabajador, hasta 4 trabajadores.",
            position: { x: 464, y: 288 },
            cost: { trabajo: 1, madera: 2 },
            action: { trabajo: -1, madera: 4 },
            image:
              "13kMKII0;185MQMM0;13kMUII0;1DkdJCF0;1DkhQCF0;43ZnPAAh;0pkoRDDV;2CkjmMMF;2CkepMMF;2CkgjMMF",
          },
          {
            name: "Granja",
            description:
              "Una plantación de trigo que produce 4 de comida si tiene un trabajador.",
            position: { x: 432, y: 288 },
            cost: { trabajo: 1, madera: 1 },
            requirement: "Require tierra fertil",
            action: { trabajo: -1, comida: 4 },
            image:
              "00iWWZZ0;0SjWWYYC;2R7JDMM0;2R7WDMM0;YR7jDMM0;YR8jRMM0;2R8WRMM0;YR8JRMM0;2R9JfMM0;YR9WfMM0;YR9jfMM0",
          },
        ],
        resources: {
          comida: {
            name: "Comida",
            description:
              "Se obtiene de buscar comida en un bosque, hacer plantaciones o criar animales. Los aldeanos necesitan 1 de comida por día.",
            image: "0uDaGII0;0q5bZOT3;0q5RZOTL;2LCT9IIg;08PKRFCH",
            current: 20,
          },
          trabajo: {
            name: "Trabajo",
            description:
              "Un dia de trabajo de un aldeano. Todos los días, tu trabajo se iguala a tu población.",
            image: "0m8ffVR0;088fGMM0;08RLgUU0;08mLgOO0;001LcG5C;001OgD5O",
            hidden: true,
            current: 50,
          },
          madera: {
            name: "Madera",
            description:
              "Se obtiene de campamentos acerraderos cerca de árboles. Útil para construir estructuras rápidamente.",
            image: "2CkbVYYG;2CkQcYYG;2CkUPYYG",
            current: 25,
            produced: 10,
            consumed: 6,
          },
          piedra: {
            name: "Piedra",
            description:
              "Se obtiene de campamentos mineros cerca de piedras. Útil para construir estructuras mas sólidas y duraderas.",
            image: "20eZTZZ0;21dNeWW0;21dpgLLT",
            current: 10,
            produced: 2,
          },
        },
      },
    },
  ],
};
