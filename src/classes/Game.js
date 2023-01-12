export default class Game {
  constructor(worldData) {
    this.worldData = worldData;
  }

  calculateIncome(civ) {
    let income = {};
    for (var i in civ.state.instances) {
      // for every instance in that civilization
      const inst = civ.state.instances[i];

      const instIncome = this.calculateInstanceIncome(civ, inst);
      for (var p in instIncome) {
        if (income[p] == null) {
          income[p] = 0;
        }
        income[p] += instIncome[p];
      }
    }

    for (var e in civ.state.events) {
      // for every event in that civilization
      const event = civ.state.events[e];
      let production = event.resources;

      for (var p in production) {
        if (income[p] == null) {
          income[p] = 0;
        }
        income[p] += production[p];
      }
    }

    return income;
  }

  calculatePersistentIncome(civ) {
    let income = this.calculateIncome(civ);

    let persistentIncome = {};
    for (var i in income) {
      if (this.worldData.resources[i].pers) {
        persistentIncome[i] = income[i];
      }
    }

    return persistentIncome;
  }

  calculateNonPersistentIncome(civ) {
    let income = this.calculateIncome(civ);

    let nonPersistentIncome = {};
    for (var i in income) {
      if (!this.worldData.resources[i].pers) {
        nonPersistentIncome[i] = income[i];
      }
    }

    return nonPersistentIncome;
  }

  calculateInstanceIncome(civ, inst, hidePersistant, hideNonPersistant) {
    let income = {};
    let hasIncome = false;
    let passive = civ.state.bases[inst.id].pass;
    let production = civ.state.bases[inst.id].prod;
    let individualProduction = inst.prod;
    let workers = inst.work;

    for (var p in passive) {
      if (income[p] == null) {
        income[p] = 0;
      }
      income[p] += passive[p];
      if (this.worldData.resources[p].pers == true) {
        hasIncome = true;
      }
    }

    for (var p in production) {
      if (income[p] == null) {
        income[p] = 0;
      }
      if (workers != null) {
        income[p] += production[p] * workers;
      }
      if (this.worldData.resources[p].pers == true) {
        if (income[p] != 0) {
          hasIncome = true;
        }
      }
    }

    for (var p in individualProduction) {
      if (income[p] == null) {
        income[p] = 0;
      }
      income[p] += individualProduction[p];
      if (income[p] != 0) {
        hasIncome = true;
      }
    }

    if (hideNonPersistant) {
      for (var p in income) {
        if (this.worldData.resources[p].pers) {
          delete income[p];
        }
      }
    }

    if (hidePersistant) {
      for (var p in income) {
        if (!this.worldData.resources[p].pers) {
          delete income[p];
        }
      }
    }

    return income;
  }
}
