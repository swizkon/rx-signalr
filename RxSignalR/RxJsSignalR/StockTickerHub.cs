namespace RxJsSignalR
{
    using System.Collections.Generic;

    using Microsoft.AspNet.SignalR;
    using Microsoft.AspNet.SignalR.Hubs;

    [HubName("stockTickerMini")]
    public class StockTickerHub : Hub
    {
        private readonly StockTicker _stockTicker;

        public StockTickerHub() : this(StockTicker.Instance) { }

        public StockTickerHub(StockTicker stockTicker)
        {
            this._stockTicker = stockTicker;
        }

        public IEnumerable<Stock> GetAllStocks()
        {
            return this._stockTicker.GetAllStocks();
        }

        public bool LogCompletedTask(string displayName, string taskName)
        {
            return this._stockTicker.LogCompletedTask(displayName, taskName);
        }
    }
}