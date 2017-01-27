using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RxJsSignalR
{
    using System.Collections.Concurrent;

    public class WorkerController : ApiController
    {


        private static ConcurrentDictionary<string, string> data = new ConcurrentDictionary<string, string>();

        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
            if (data.TryAdd(value, value))
            {
                StockTicker.Instance.LogCompletedTask(value, value);
            }
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }
    }
}