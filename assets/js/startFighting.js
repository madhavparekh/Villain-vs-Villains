var jokerObj = {
    name: "",
    strength: 0,
    strengthLeft: 0,
    strikePower: 0,
    strikes: 0
}
var strikePower = {
    Heath: 5,
    Jack: 25,
    Lego: 8,
    Cartoon: 15
}

var myJoker = Object.create(jokerObj);
var oppJoker = Object.create(jokerObj);
var playerPicked = false;
var opponentPicked = false;
var allDone = false;
var lost = false;

$(document).ready(function(){
    $('#eliminated').hide();
    $('.playground').hide();
    $('#fightarea').hide();
    $('.reset').hide();
    
    $('img').on('click', function(e){
        
        //picking players
        if(!opponentPicked){
            var playerId = $(e.target).parent().parent();
            playerId.removeClass('col-2');
            playerId.addClass('col-6');
            $('#them').parent().find('h1').html('One of them');
            
            if(!playerPicked){
                setUpPlayer(myJoker, playerId);
                playerId.appendTo('#you');
                $('#picker-header').html('Now Pick your opponent to fight');
                playerPicked = true;
            }
            else{
                setUpPlayer(oppJoker, playerId);
                playerId.appendTo('#them');
                opponentPicked = true;
                //gray out other opponents till done with one selected
                $('#players').css('opacity', '0.5');
                $('#picker-header').html('Fight.. Fight.. Fight..');
                $('#fightarea').show();
            }
            $('.playground').show();
        }
    });
    
    //Call fightAlgo
    $('#strike').click(function(){
        myJoker.strikes++;
        oppJoker.strengthLeft -= myJoker.strikePower * myJoker.strikes;
        myJoker.strengthLeft -= oppJoker.strikePower;
        console.log('my ' +myJoker.strengthLeft +' opp ' +oppJoker.strengthLeft);

        $('#you').find('.card-text.sLeft').html(myJoker.strengthLeft);
        $('#them').find('.card-text.sLeft').html(oppJoker.strengthLeft);
  
        if(oppJoker.strengthLeft <= 0){
            $('#eliminated').show();
            moveCardToEliminated($('#them').find('.joker'));
            opponentPicked = false;
            //All effect of winning will go here
            $('#them').parent().find('h1').html('Excellent! Go challenge next one');
            $('#picker-header').html('Pick next one to fight');
            $('#players').css('opacity', '1.0');
            $('#fightarea').hide();
            
            //check to see if any opponent left
            if($.trim($('#players').html()) == ''){
                $('#them').parent().find('h1').html('Yay, Gotham is all yours');
                allDone = true;
                lost = false;
                $('.reset').show();
            }    
        }
        else if(myJoker.strengthLeft <= 0){
            $('#eliminated').show();
            moveCardToEliminated($('#you').find('.joker'));
            //All effect of losing will go here
            $('.reset').show();
            $('#fightarea').hide();
            lost = true;
            allDone = true;
            $('#you').parent().find('h1').html('You have been eliminated! Click "Rematch" to try again');
        }
    });

    $('#reset').on('click', function(){
        if(allDone){
            
            //move left over cards from #you/#them to #players
            if(lost)
                moveCardToPlayers('#them');
            else
                moveCardToPlayers('#you');
             
            //move all cards from div .eliminated to #players
            $('.eliminated').find('.sLeft').remove();
            $('.eliminated').find('.joker').appendTo('#players');
            $('#players').find('.life').show();
            $('#players').css('opacity', '1.0');
            $('#picker-header').html('Pick your Villian');
            $('#you').parent().find('h1').html('You');
            $('#them').parent().find('h1').html('One of them');

            //reset all booleans and scores..
            playerPicked = false;
            opponentPicked = false;
            allDone = false;
            myJoker.strikes = 0;
            lost = false;
            //hide divs
            $('#eliminated').hide();
            $('.playground').hide();
            $('#fightarea').hide();
            $('.reset').hide();
        }
    });

    function moveCardToPlayers(who){
        $(who).find('.joker').removeClass('col-6');
        $(who).find('.joker').addClass('col-2');
        $(who).find('.sLeft').remove();
        $(who).find('.joker').appendTo('#players');
    }

    function moveCardToEliminated(card){
        card.removeClass('col-6');
        card.addClass('col-2');
        card.appendTo('.eliminated');
    }

    function setUpPlayer(player, playerId){
        player.name = playerId.find('.card-title').text();
        player.strength = parseInt(playerId.find('.card-text').text());
        player.strengthLeft = player.strength;
        player.strikePower = strikePower[player.name];
        //hiding strenght and replacing with strenght Left
        playerId.find('p').hide();
        playerId.find('.card-body').append('<p class="card-text sLeft">' +player.strengthLeft +'</p>');
        console.log(player.name +' ' +player.strength + ' ' + player.strikePower);
    }
})