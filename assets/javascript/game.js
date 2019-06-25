let playerCharDiv = null; // player's chosen character
let defenderCharDiv = null; // enemy chosen to fight

// copies of elements from characterData:
let player = null;
let defender = null;

characterData = [
    {
        name: "Darth Vader",
        image: "darth-vader.png",
        healthPoints: 120,
        attackPower: 10,
        counterattackPower: 16
    },
    {
        name: "Kylo Ren",
        image: "kylo-ren.png",
        healthPoints: 100,
        attackPower: 15,
        counterattackPower: 25
    },
    {
        name: "Rey",
        image: "rey.png",
        healthPoints: 150,
        attackPower: 8,
        counterattackPower: 20
    },
    {
        name: "Han Solo",
        image: "han-solo.png",
        healthPoints: 180,
        attackPower: 5,
        counterattackPower: 18
    }
]

if ($(document).ready()) {

    $("#instructions").text("Select a character to begin.");

    // hide controls
    $("#attack").hide();
    $("#restart").hide();

    // load characters
    characterData.forEach(element => {
        //console.log(element.name);
        let $newCharacter = $("<div>");
        $newCharacter.text(element.name);
        $newCharacter.attr("class", "sm-character");
        $newCharacter.attr("name", element.name.toLowerCase().replace(" ","-"));
        $newCharacter.attr("data-index", characterData.indexOf(element));
        
        let $characterImage = $("<img>");
        $characterImage.attr("src", "assets/images/" + element.image);
        $newCharacter.append($characterImage);

        let $healthPoints = $("<div>");
        $healthPoints.attr("class", "health-points");
        $healthPoints.attr("data-starting-hp", element.healthPoints); // to use when restarting
        $healthPoints.text(element.healthPoints);
        $newCharacter.append($healthPoints);

        $("#all-characters").append($newCharacter);
    });
}

$(".sm-character").on("click", function () {
    if (player === null) { // character has not been chosen yet
        //console.log("clicked " + $(this).attr("name"));
        var element = $(this).detach();
        $("#player-area").append(element);
        playerCharDiv = this;
        $(this).attr("id", "player");

        // copy character data and add baseAttackPower
        player = Object.assign({}, characterData[$(playerCharDiv).attr("data-index")]);
        player.baseAttackPower = player.attackPower;

        // remaining characters become enemies to defeat
        $( ".sm-character" ).each(function() {
            if (this !== playerCharDiv) {
                var element = $(this).detach();
                $("#enemies").append(element);
            }
        });

        $("#instructions").text("Select an enemy to attack.");
    }
    else if (defender === null) { // defender has not been chosen yet
        var element = $(this).detach();
        $("#defender-area").append(element);
        defenderCharDiv = this;
        $(this).attr("id", "defender");

        // copy character data
        defender = Object.assign({}, characterData[$(defenderCharDiv).attr("data-index")]);
    
        $("#attack").show();
    }

});

$("#attack").on("click", function () {
    // player attacks
    defender.healthPoints -= player.attackPower;
    $("#defender .health-points").text(defender.healthPoints);

    if (defender.healthPoints <= 0) {
        // defender loses
        $("#instructions").text("You defeated " + defender.name + "!");
        $("#defender").hide();
        $("#defender").removeAttr("id");
        defender = null;
        $("#attack").hide();

        // check for any enemies remaining
        if ($("#enemies").children("div").length === 0) {
            $("#instructions").text("You win! Click the Restart button to play again.");
            $("#restart").show();
        }

        return;
    }

    // defender counter-attacks
    player.healthPoints -= defender.counterattackPower;
    $("#player .health-points").text(player.healthPoints);

    if (player.healthPoints <= 0) {
        // player loses
        $("#instructions").text("You have been defeated \u2014 GAME OVER!");
        $("#restart").show();
        $("#attack").hide();
    } 
    else {
        $("#instructions").text("You attacked " + defender.name + " for " + player.attackPower + " damage.\n " + defender.name + " counter-attacked for " + defender.counterattackPower + " damage.");

        // increase player's attack power
        player.attackPower += player.baseAttackPower;
    }

});

$("#restart").on("click", function () {
    var characters = $(".sm-character").detach();
    $("#all-characters").append(characters);
    $(".sm-character").show();
    $("#player").removeAttr("id");
    $("#defender").removeAttr("id");

    // reset displayed health points
    $(".health-points").each( function() {
         $(this).text( $(this).attr("data-starting-hp") );
    });    
    
    $("#instructions").text("Click a character to begin.");

    player = null;
    defender = null;
    $("#restart").hide();
});