characterData = [
    {
        name: "Darth Vader",
        image: "darth-vader.png",
        healthPoints: 10,
        attackPower: 10,
        counterattackPower: 10
    },
    {
        name: "Kylo Ren",
        image: "kylo-ren.png",
        healthPoints: 10,
        attackPower: 10,
        counterattackPower: 10
    },
    {
        name: "Rey",
        image: "rey.png",
        healthPoints: 10,
        attackPower: 10,
        counterattackPower: 10
    },
    {
        name: "Han Solo",
        image: "han-solo.png",
        healthPoints: 10,
        attackPower: 10,
        counterattackPower: 10
    }
]

if ($(document).ready()) {
    console.log("ready");
    
    characterData.forEach(element => {
        console.log(element.name);
        let $newCharacter = $("<div>");
        $newCharacter.text(element.name);
        $newCharacter.attr("class", "sm-character");
        $newCharacter.attr("name", element.name.toLowerCase().replace(" ","-"));
        let $characterImage = $("<img>");
        $characterImage.attr("src", "assets/images/" + element.image);
        $newCharacter.prepend($characterImage);
        $("#all-characters").append($newCharacter);
    });
}

$(".sm-character").on("click", function () {
    console.log("clicked " + $(this).attr("name"));
    var element = $(this).detach();
    $("#chosen-character").append(element);
});