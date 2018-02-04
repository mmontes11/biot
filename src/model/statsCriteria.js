const StatsCriteriaID = Object.freeze({
    address: "address",
    thing: "thing"
});

export class StatsCriteria {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    static addressStatsCriteria() {
        return new StatsCriteria(StatsCriteriaID.address, "Address");
    }
    static thingStatsCriteria() {
        return new StatsCriteria(StatsCriteriaID.thing, "Thing");
    }
}