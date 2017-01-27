/// <reference path="~/Scripts/rx.all.js"/>

// A simple templating method for replacing placeholders enclosed in curly braces.
if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}


var allChannels = new Vue({
    //   <button v-on:click="counter += 1">Add 1</button>
    el: '#all-channels',
    data: {
        label: 'The channels',
        channels: []
    }
});

Vue.component('channel-item',
{
    props: ['channel'],
    template: '<li>{{ channel.name }}</li>'
});



var recentMessages = new Vue({
    el: '#recent-messages',
    data: {
        label: 'Recent messages',
        messages: []
    }
});

Vue.component('message-item',
{
    props: ['message'],
    template: '<li>{{ message }}</li>'
});


var allMessages = new Vue({
    el: '#all-messages',
    data: {
        label: 'The label',
        messages: []
    }
});


var subject = new Rx.Subject();
var subscription = subject.subscribe(
    function (x) {
        $('#discussion').html(JSON.stringify(x));
        // console.log(x);
    },
    function (e) { console.log('onError: ' + e.message); },
    function () { console.log('onCompleted'); });


$(function () {

    var ticker = $.connection.stockTickerMini, // the generated client-side hub proxy
        up = '▲',
        down = '▼',
        $stockTable = $('#stockTable'),
        $stockTableBody = $stockTable.find('tbody'),
        rowTemplate = '<tr data-symbol="{Symbol}"><td>{Symbol}</td><td>{Price}</td><td>{DayOpen}</td><td>{Direction} {Change}</td><td>{PercentChange}</td></tr>';

    var xingZen = $.connection.xingZen;

    function formatStock(stock) {
        return $.extend(stock, {
            Price: stock.Price.toFixed(2),
            PercentChange: (stock.PercentChange * 100).toFixed(2) + '%',
            Direction: stock.Change === 0 ? '' : stock.Change >= 0 ? up : down
        });
    }

    function init() {

        xingZen.server.allChannels().done(function(channels) {
            allChannels.channels = channels;
            console.log(channels);
        });

        ticker.server.getAllStocks().done(function (stocks) {
            $stockTableBody.empty();
            $.each(stocks, function () {
                var stock = formatStock(this);
                $stockTableBody.append(rowTemplate.supplant(stock));
            });
        });

        // $('#displayname').val(prompt('Enter your name:', ''));
        $('#sendmessage').click(function () {
            ticker.server.logCompletedTask($('#displayname').val(), $('#message').val());
            $('#message').val('').focus();
        });

    }

    // Add a client-side hub method that the server will call
    ticker.client.updateStockPrice = function (stock) {

        // subject.onNext(stock);
        var displayStock = formatStock(stock),
            $row = $(rowTemplate.supplant(displayStock));

        $stockTableBody.find('tr[data-symbol=' + stock.Symbol + ']')
            .replaceWith($row);
    }

    // Add a client-side hub method that the server will call
    ticker.client.taskCompleted = function (task) {
        allMessages.messages.push(task);
        subject.onNext(task);
    }

    // Start the connection
    $.connection.hub.start().done(init);
});