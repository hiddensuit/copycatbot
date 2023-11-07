const acItems = require("../../resources/acnh-items.json");

module.exports = {
  name: "aclu",
  testOnly: true,
  callback: async (client, m, args) => {
    function lookUp(searchName) {
      return acItems.find((i) => {
        return i.searchName == searchName.toLowerCase();
      });
    }

    console.log(lookUp("ant"));
  },
};
