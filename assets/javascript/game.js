let playerCharDiv = null; // player's chosen character
let defenderCharDiv = null; // enemy chosen to fight

// copies of elements from characterData:
let player = null;
let defender = null;

characterData = [
    {
        name: "Darth Vader",
        image: "darth-vader.png",
        healthPoints: 100,
        attackPower: 13,
        counterattackPower: 16
    },
    {
        name: "Kylo Ren",
        image: "kylo-ren.png",
        healthPoints: 90,
        attackPower: 16,
        counterattackPower: 21
    },
    {
        name: "Rey",
        image: "rey.png",
        healthPoints: 140,
        attackPower: 10,
        counterattackPower: 19
    },
    {
        name: "Han Solo",
        image: "han-solo.png",
        healthPoints: 125,
        attackPower: 8,
        counterattackPower: 17
    }
]

if ($(document).ready()) {

    $("#instructions").text("Select a character to begin.");

    // hide controls
    $("#attack").hide();
    $("#restart").hide();
    $("#enemies").hide();
    $("#player-area").hide();
    $("#defender-area").hide();

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
        $("#player-area").show();
        $("#enemies").show();
    }
    else if ((defender === null) && ($(this).attr("id") === undefined)) { 
        // defender has not been chosen yet AND character isn't the player's character
        var element = $(this).detach();
        $("#defender-area").append(element);
        defenderCharDiv = this;
        $(this).attr("id", "defender");

        // copy character data
        defender = Object.assign({}, characterData[$(defenderCharDiv).attr("data-index")]);
    
        $("#attack").show();
        $("#defender-area").show();
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
        $("#defender-area").hide();

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
        $("#instructions").html("You attacked " + defender.name + " for " + player.attackPower + " damage.<br>" + defender.name + " counter-attacked for " + defender.counterattackPower + " damage.");

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
    $("#enemies").hide();
});