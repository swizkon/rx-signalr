namespace RxJsSignalR
{
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;

    using Microsoft.AspNet.SignalR;
    using Microsoft.AspNet.SignalR.Hubs;

    [HubName("xingZen")]
    public class XingZenHub : Hub
    {
        private readonly XingZen _xingZen;

        public XingZenHub() : this(XingZen.Instance) { }

        public XingZenHub(XingZen xingZen)
        {
            _xingZen = xingZen;
        }
        
        public IEnumerable<Channel> AllChannels()
        {
            return _xingZen.AllChannels();
        }

        public void LogCompletedTask(string displayName, string taskName)
        {
            this.Clients.All.taskCompleted($"{taskName} ({displayName}) ");
        }
    }

    public class XingZen
    {
        // Singleton instance
        private readonly static Lazy<XingZen> _instance = new Lazy<XingZen>(() => new XingZen(GlobalHost.ConnectionManager.GetHubContext<XingZenHub>().Clients));

        private readonly ConcurrentDictionary<string, Channel> _channels = new ConcurrentDictionary<string, Channel>();
        
        public static XingZen Instance => _instance.Value;

        private XingZen(IHubConnectionContext<dynamic> clients)
        {
            this.Clients = clients;

            this._channels.Clear();
            var channels = new List<Channel>
            {
                new Channel { channelId = "MSFT", name = "The channel for MS" },
                new Channel { channelId = "APPL", name = "The channel for Apple" },
                new Channel { channelId = "GOOG", name = "The channel for Google"}
            };
            channels.ForEach(channel => this._channels.TryAdd(channel.channelId, channel));
        }

        private IHubConnectionContext<dynamic> Clients
        {
            get;
            set;
        }

        public IEnumerable<Channel> AllChannels()
        {
            return this._channels.Values;
        }
    }

    public class Channel
    {
        public string channelId { get; set; }
        public string name { get; set; }
    }
}